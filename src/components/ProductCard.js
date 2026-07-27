import Link from "next/link";
import Image from "next/image";
import SizeRun from "./SizeRun";

function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor));
}

export default function ProductCard({ producto }) {
  return (
    <Link
      href={`/producto/${producto.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent/60"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface2">
        <Image
          src={producto.imageUrl}
          alt={producto.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-bg/80 px-3 py-1 text-[11px] font-semibold text-accent">
          {producto.category?.name}
        </span>
        {producto.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-accent2 px-3 py-1 text-[11px] font-semibold text-bg">
            Agotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {producto.brand && (
            <p className="text-[12px] font-medium text-muted">
              {producto.brand}
            </p>
          )}
          <h3 className="font-display text-lg font-bold leading-snug text-ink">
            {producto.name}
          </h3>
        </div>
        <SizeRun sizes={producto.sizes} compact />
        <p className="mt-auto font-display text-lg font-extrabold text-accent">
          {formatoPrecio(producto.price)}
        </p>
      </div>
    </Link>
  );
}
