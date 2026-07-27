import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductTable from "@/components/ProductTable";

export const dynamic = "force-dynamic";

export default async function AdminProductos() {
  const productos = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-ink">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-bg transition hover:bg-ink"
        >
          + Nuevo producto
        </Link>
      </div>
      <ProductTable productos={productos} />
    </div>
  );
}
