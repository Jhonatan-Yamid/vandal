import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditarProducto({ params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const producto = await prisma.product.findUnique({ where: { id } });

  if (!producto) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold text-ink">Editar producto</h1>
      <ProductForm producto={producto} />
    </div>
  );
}
