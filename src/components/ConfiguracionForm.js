"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfiguracionForm({ config }) {
  const router = useRouter();
  const [porcentaje, setPorcentaje] = useState(config.priceMarkupPercent ?? 0);
  const [dias, setDias] = useState(config.productMaxAgeDays ?? "");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk(false);
    setCargando(true);

    const res = await fetch("/api/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceMarkupPercent: Number(porcentaje),
        productMaxAgeDays: dias === "" ? null : Number(dias),
      }),
    });

    setCargando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo guardar la configuración.");
      return;
    }

    setOk(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <label className="mb-1 block text-sm font-semibold text-ink">
          Porcentaje de ganancia
        </label>
        <p className="mb-3 text-sm text-muted">
          Se suma al precio de cada producto solo en las páginas públicas
          (catálogo, destacado, detalle). El precio guardado en la base de
          datos no cambia — así puedes ajustarlo cuando quieras y se
          actualiza en todo el sitio al instante.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="1"
            min="0"
            value={porcentaje}
            onChange={(e) => setPorcentaje(e.target.value)}
            className="w-32 rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
          />
          <span className="text-ink">%</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <label className="mb-1 block text-sm font-semibold text-ink">
          Días antes de eliminar un producto automáticamente
        </label>
        <p className="mb-3 text-sm text-muted">
          Un cron job externo llama a un endpoint diario que borra los
          productos con más días de creados que este número. Déjalo vacío
          para desactivar la limpieza automática.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="1"
            min="1"
            placeholder="Ej: 8"
            value={dias}
            onChange={(e) => setDias(e.target.value)}
            className="w-32 rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
          />
          <span className="text-ink">días</span>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-accent2/40 bg-accent2/10 px-3 py-2 text-sm text-accent2">
          {error}
        </p>
      )}
      {ok && (
        <p className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          Configuración guardada.
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="w-fit rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-bg transition hover:bg-ink disabled:opacity-50"
      >
        {cargando ? "Guardando..." : "Guardar configuración"}
      </button>
    </form>
  );
}
