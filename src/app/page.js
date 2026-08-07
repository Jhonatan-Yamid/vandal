import { prisma } from "@/lib/prisma";
import { getConfiguracion } from "@/lib/config";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductHero from "@/components/ProductHero";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [productos, config] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    getConfiguracion(),
  ]);

  const productoDestacado = productos[0] || null;
  const sugeridos = productos.slice(0, 6);
  const markup = config.priceMarkupPercent;

  return (
    <div className="min-h-screen">
      <Navbar />

      <ProductHero producto={productoDestacado} sugeridos={sugeridos} markup={markup} />

      {/* Catálogo */}
      <section id="catalogo" className="mx-auto max-w-7xl px-6 py-16">
        {productos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-24 text-center text-muted">
            Aún no hay productos en el catálogo.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} markup={markup} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted">
        © {new Date().getFullYear()} VANDAL — Tienda de tenis
      </footer>
    </div>
  );
}
