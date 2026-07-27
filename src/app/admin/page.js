import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [totalProductos, totalCategorias, sinStock] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { stock: 0 } }),
  ]);

  const tarjetas = [
    { label: "Productos", valor: totalProductos, href: "/admin/productos" },
    { label: "Categorías", valor: totalCategorias, href: "/admin/categorias" },
    { label: "Sin existencias", valor: sinStock, href: "/admin/productos" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Panel de control</h1>
      <p className="mt-1 text-muted">Gestiona el catálogo de la tienda.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-xl border border-border bg-surface p-6 transition hover:border-accent"
          >
            <p className="text-sm font-medium text-muted">{t.label}</p>
            <p className="mt-2 font-display text-4xl font-extrabold text-accent">{t.valor}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex gap-4">
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-bg transition hover:bg-ink"
        >
          + Nuevo producto
        </Link>
        <Link
          href="/admin/categorias"
          className="rounded-full border border-border px-6 py-3 text-[15px] font-semibold text-ink transition hover:border-accent hover:text-accent"
        >
          Gestionar categorías
        </Link>
      </div>
    </div>
  );
}
