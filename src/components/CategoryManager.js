"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryManager({ categorias }) {
  const router = useRouter();
  const [nombreNueva, setNombreNueva] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEdicion, setNombreEdicion] = useState("");

  async function crearCategoria(e) {
    e.preventDefault();
    setError("");
    if (!nombreNueva.trim()) return;

    setCargando(true);
    const res = await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nombreNueva.trim() }),
    });
    setCargando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo crear la categoría.");
      return;
    }
    setNombreNueva("");
    router.refresh();
  }

  async function guardarEdicion(id) {
    if (!nombreEdicion.trim()) return;
    const res = await fetch(`/api/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nombreEdicion.trim() }),
    });
    if (res.ok) {
      setEditandoId(null);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "No se pudo actualizar.");
    }
  }

  async function eliminarCategoria(cat) {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    const res = await fetch(`/api/categorias/${cat.id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "No se pudo eliminar.");
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <form onSubmit={crearCategoria} className="flex gap-3">
        <input
          value={nombreNueva}
          onChange={(e) => setNombreNueva(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="flex-1 rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={cargando}
          className="rounded-full bg-accent px-5 py-2 text-[14px] font-semibold text-bg transition hover:bg-ink disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
      {error && (
        <p className="-mt-4 rounded-md border border-accent2/40 bg-accent2/10 px-3 py-2 text-sm text-accent2">
          {error}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {categorias.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
          >
            {editandoId === cat.id ? (
              <input
                autoFocus
                value={nombreEdicion}
                onChange={(e) => setNombreEdicion(e.target.value)}
                className="mr-3 flex-1 rounded-md border border-accent bg-surface2 px-2 py-1 text-ink outline-none"
              />
            ) : (
              <div>
                <p className="text-ink">{cat.name}</p>
                <p className="text-xs text-muted">
                  {cat._count?.products ?? 0} producto(s)
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {editandoId === cat.id ? (
                <>
                  <button
                    onClick={() => guardarEdicion(cat.id)}
                    className="rounded-full border border-accent px-3 py-1.5 text-[13px] font-medium text-accent"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="rounded-full border border-border px-3 py-1.5 text-[13px] font-medium text-muted"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditandoId(cat.id);
                      setNombreEdicion(cat.name);
                    }}
                    className="rounded-full border border-border px-3 py-1.5 text-[13px] font-medium text-ink transition hover:border-accent hover:text-accent"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarCategoria(cat)}
                    className="rounded-full border border-border px-3 py-1.5 text-[13px] font-medium text-muted transition hover:border-accent2 hover:text-accent2"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
