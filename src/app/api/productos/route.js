import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");

  const productos = await prisma.product.findMany({
    where: categoria ? { category: { slug: categoria } } : {},
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(productos);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { name, brand, description, price, imageUrl, stock, sizes, categoryId } = body;

  if (!name || !description || !price || !imageUrl || !sizes || !categoryId) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  const producto = await prisma.product.create({
    data: {
      name,
      brand: brand || null,
      description,
      price,
      imageUrl,
      stock: Number(stock) || 0,
      sizes,
      categoryId: Number(categoryId),
    },
  });

  return NextResponse.json(producto, { status: 201 });
}
