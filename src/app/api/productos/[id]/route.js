import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request, { params }) {
  const producto = await prisma.product.findUnique({
    where: { id: Number(params.id) },
    include: { category: true },
  });

  if (!producto) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json(producto);
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { name, brand, description, price, imageUrl, stock, sizes, categoryId } = body;

  try {
    const data = {
      name: name.toUpperCase(),
      brand: brand || null,
      description,
      price,
      imageUrl,
      stock: Number(stock) || 0,
      sizes,
    };
    // Solo se cambia la categoría si el formulario la envía explícitamente
    // (el formulario actual no la envía, para no alterar la categoría existente)
    if (categoryId) data.categoryId = Number(categoryId);

    const producto = await prisma.product.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(producto);
  } catch (err) {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
  }
}

export async function DELETE(_request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await prisma.product.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 400 });
  }
}
