import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NuevoProducto() {
  const categorias = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold text-ink">Nuevo producto</h1>
      {categorias.length === 0 ? (
        <p className="text-muted">
          Primero crea al menos una categoría en{" "}
          <a href="/admin/categorias" className="text-accent underline">
            Categorías
          </a>
          .
        </p>
      ) : (
        <ProductForm categorias={categorias} />
      )}
    </div>
  );
}
