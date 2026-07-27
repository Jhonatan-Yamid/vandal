import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import SizeRun from "@/components/SizeRun";
import WhatsAppOrder from "@/components/WhatsAppOrder";

export const dynamic = "force-dynamic";

function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor));
}

export default async function DetalleProducto({ params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const producto = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!producto) notFound();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <Link href="/" className="text-[14px] font-medium text-muted hover:text-accent">
          ← Volver al catálogo
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface2">
            <Image
              src={producto.imageUrl}
              alt={producto.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <Link
                href={`/?categoria=${producto.category.slug}#catalogo`}
                className="text-[13px] font-semibold text-accent"
              >
                {producto.category.name}
              </Link>
              {producto.brand && (
                <p className="mt-1 text-sm font-medium text-muted">
                  {producto.brand}
                </p>
              )}
              <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                {producto.name}
              </h1>
            </div>

            <p className="font-display text-3xl font-extrabold text-accent">
              {formatoPrecio(producto.price)}
            </p>

            <p className="max-w-xl leading-relaxed text-muted">
              {producto.description}
            </p>

            <div>
              <p className="mb-2 text-sm font-semibold text-muted">
                Tallas disponibles
              </p>
              <SizeRun sizes={producto.sizes} />
            </div>

            <p className="text-sm text-muted">
              {producto.stock > 0
                ? `${producto.stock} pares disponibles`
                : "Sin existencias por ahora"}
            </p>

            <WhatsAppOrder
              producto={{
                id: producto.id,
                name: producto.name,
                sizes: producto.sizes,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
