import Link from "next/link";
import Image from "next/image";

function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor));
}

export default function ProductHero({ producto, sugeridos }) {
  if (!producto) return null;

  return (
    <section className="relative overflow-hidden border-b border-border bg-white">
      {/* Texto gigante decorativo de fondo: nombre de la categoría */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 select-none font-display text-[13rem] font-extrabold uppercase leading-none text-accent/[0.06] lg:block"
      >
        {producto.category?.name}
      </span>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-6">
        {/* Columna de texto */}
        <div className="relative z-10 flex flex-col gap-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {producto.brand ? `${producto.brand} · ` : ""}
            {producto.category?.name}
          </p>
          <h1 className="max-w-lg font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            {producto.name}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted">
            {producto.description}
          </p>
          <p className="font-display text-3xl font-extrabold text-accent">
            {formatoPrecio(producto.price)}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/producto/${producto.id}`}
              className="inline-block rounded-full bg-accent px-8 py-3 text-[15px] font-semibold text-bg transition hover:bg-ink"
            >
              Comprar ahora
            </Link>
            <Link
              href="#catalogo"
              className="text-[15px] font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 transition hover:text-accent"
            >
              Ver todo el catálogo
            </Link>
          </div>
        </div>

        {/* Imagen destacada */}
        <div className="relative z-10 flex justify-center lg:justify-end">
          <div className="absolute inset-0 -z-10 m-auto h-64 w-64 rounded-full bg-accent/10 blur-2xl sm:h-80 sm:w-80" />
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface2 shadow-xl shadow-accent/10 sm:rotate-3 sm:transition sm:duration-500 sm:hover:rotate-0">
            <Image
              src={producto.imageUrl}
              alt={producto.name}
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Franja de miniaturas (otros productos, estilo swatches) */}
      {sugeridos?.length > 0 && (
        <div className="relative z-10 border-t border-border bg-surface2/60">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-6 py-5">
            <span className="shrink-0 text-sm font-medium text-muted">
              También en tienda
            </span>
            {sugeridos.map((s) => (
              <Link
                key={s.id}
                href={`/producto/${s.id}`}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition ${
                  s.id === producto.id
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-border hover:border-accent"
                }`}
                title={s.name}
              >
                <Image
                  src={s.imageUrl}
                  alt={s.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
