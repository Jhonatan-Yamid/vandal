"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor));
}

export default function ProductTable({ productos }) {
  const router = useRouter();
  const [borrandoId, setBorrandoId] = useState(null);

  async function handleDelete(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    setBorrandoId(id);
    const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
    setBorrandoId(null);
    if (res.ok) {
      router.refresh();
    } else {
      alert("No se pudo eliminar el producto.");
    }
  }

  if (productos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted">
        Aún no hay productos. Crea el primero.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface text-[13px] font-semibold text-muted">
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-none">
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{p.name}</p>
                {p.brand && <p className="text-xs text-muted">{p.brand}</p>}
              </td>
              <td className="px-4 py-3 text-muted">{p.category?.name}</td>
              <td className="px-4 py-3 text-ink">{formatoPrecio(p.price)}</td>
              <td className="px-4 py-3">
                <span
                  className={p.stock === 0 ? "text-accent2" : "text-ink"}
                >
                  {p.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="rounded-full border border-border px-3 py-1.5 text-[13px] font-medium text-ink transition hover:border-accent hover:text-accent"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={borrandoId === p.id}
                    className="rounded-full border border-border px-3 py-1.5 text-[13px] font-medium text-muted transition hover:border-accent2 hover:text-accent2 disabled:opacity-50"
                  >
                    {borrandoId === p.id ? "..." : "Eliminar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
