import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { enviarMensajeWhatsApp, descargarMediaWhatsApp } from "@/lib/whatsapp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const NUMEROS_PERMITIDOS = (process.env.WHATSAPP_ALLOWED_NUMBERS || "")
  .split(",")
  .map((n) => n.trim())
  .filter(Boolean);

const CATEGORIA_SLUG_DEFECTO = process.env.CATEGORIA_SLUG_DEFECTO || "sin-categoria";
const TALLAS_DEFECTO = process.env.TALLAS_DEFECTO || "36,37,38,39,40,41";
const STOCK_DEFECTO = Number(process.env.STOCK_DEFECTO || 5);

// Meta llama a este GET una vez, para verificar que el webhook es tuyo
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const modo = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (modo === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Token inválido" }, { status: 403 });
}

function limpiarEmojis(texto) {
  return texto
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parsearMensaje(caption) {
  if (!caption) return null;

  const precioMatch = caption.match(/pares[^\d]{0,15}([\d.,]+)/i);
  if (!precioMatch) return null; // no trae el formato esperado

  const precio = Number(precioMatch[1].replace(/\./g, "").replace(/,/g, ""));
  if (!precio) return null;

  const lineas = caption.split("\n").map((l) => l.trim()).filter(Boolean);
  const nombre = limpiarEmojis(lineas[0] || "Producto sin nombre");

  const docenasMatch = caption.match(/curvas\s*&?\s*docenas[^\d]{0,15}([\d.,]+)/i);
  const precioDocena = docenasMatch
    ? Number(docenasMatch[1].replace(/\./g, "").replace(/,/g, ""))
    : null;

  return { nombre, precio, precioDocena };
}

// Meta llama a este POST cada vez que llega un mensaje al número dedicado
export async function POST(request) {
  const body = await request.json();

  try {
    const mensaje = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!mensaje) return NextResponse.json({ ok: true }); // otros eventos (ej. "leído"), ignorar

    const numeroRemitente = mensaje.from; // ej: "573192934969"
    if (!NUMEROS_PERMITIDOS.includes(numeroRemitente)) {
      return NextResponse.json({ ok: true }); // no autorizado, ignora y sigue el chat normal
    }

    if (mensaje.type !== "image" || !mensaje.image) {
      return NextResponse.json({ ok: true }); // no es una imagen, ignora
    }

    const datos = parsearMensaje(mensaje.image.caption || "");
    if (!datos) return NextResponse.json({ ok: true }); // no coincide el formato, ignora

    const categoria = await prisma.category.findUnique({
      where: { slug: CATEGORIA_SLUG_DEFECTO },
    });

    if (!categoria) {
      await enviarMensajeWhatsApp(
        numeroRemitente,
        `⚠️ No encontré la categoría "${CATEGORIA_SLUG_DEFECTO}". Créala una vez desde el panel admin.`
      );
      return NextResponse.json({ ok: true });
    }

    const { buffer } = await descargarMediaWhatsApp(mensaje.image.id);

    const subida = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tienda-tenis/productos",
          resource_type: "image",
          transformation: [{ width: 1600, height: 1600, crop: "limit" }],
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(buffer);
    });

    const descripcion = datos.precioDocena
      ? `Precio por docena/curva: $${datos.precioDocena.toLocaleString("es-CO")}. Cargado automáticamente desde WhatsApp.`
      : "Cargado automáticamente desde WhatsApp.";

    const producto = await prisma.product.create({
      data: {
        name: datos.nombre,
        description: descripcion,
        price: datos.precio,
        imageUrl: subida.secure_url,
        stock: STOCK_DEFECTO,
        sizes: TALLAS_DEFECTO,
        categoryId: categoria.id,
      },
    });

    await enviarMensajeWhatsApp(
      numeroRemitente,
      `✅ *${producto.name}* creado en la tienda por $${Number(
        producto.price
      ).toLocaleString("es-CO")}.\n🔗 ${process.env.APP_URL}/producto/${producto.id}`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error procesando webhook de WhatsApp:", err);
    return NextResponse.json({ ok: true }); // siempre 200, para que Meta no desactive el webhook
  }
}