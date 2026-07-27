import { prisma } from "@/lib/prisma";
import CategoryManager from "@/components/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategorias() {
  const categorias = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold text-ink">Categorías</h1>
      <CategoryManager categorias={categorias} />
    </div>
  );
}
