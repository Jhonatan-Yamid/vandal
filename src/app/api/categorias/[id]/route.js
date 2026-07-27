import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  try {
    const categoria = await prisma.category.update({
      where: { id: Number(params.id) },
      data: { name, slug: slugify(name) },
    });
    return NextResponse.json(categoria);
  } catch (err) {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
  }
}

export async function DELETE(_request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const enUso = await prisma.product.count({
    where: { categoryId: Number(params.id) },
  });
  if (enUso > 0) {
    return NextResponse.json(
      { error: "No se puede eliminar: hay productos asignados a esta categoría" },
      { status: 400 }
    );
  }

  try {
    await prisma.category.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 400 });
  }
}
