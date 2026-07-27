import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductHero from "@/components/ProductHero";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const categoriaSlug = searchParams?.categoria;

  const [categorias, productos, todosProductos] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: categoriaSlug ? { category: { slug: categoriaSlug } } : {},
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const productoDestacado = todosProductos[0] || null;
  const sugeridos = todosProductos.slice(0, 6);

  return (
    <div className="min-h-screen">
      <Navbar />

      <ProductHero producto={productoDestacado} sugeridos={sugeridos} />

      {/* Catálogo */}
      <section id="catalogo" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className={`rounded-full border px-4 py-2 text-[14px] font-medium transition ${
              !categoriaSlug
                ? "border-accent bg-accent text-bg"
                : "border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            Todas
          </Link>
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/?categoria=${cat.slug}#catalogo`}
              className={`rounded-full border px-4 py-2 text-[14px] font-medium transition ${
                categoriaSlug === cat.slug
                  ? "border-accent bg-accent text-bg"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {productos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-24 text-center text-muted">
            No hay productos en esta categoría todavía.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted">
        © {new Date().getFullYear()} Voltage — Tienda de tenis
      </footer>
    </div>
  );
}
