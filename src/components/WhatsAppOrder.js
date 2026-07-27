"use client";

import { useState } from "react";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2.003c-5.523 0-10 4.477-10 10 0 1.77.462 3.492 1.34 5.007L2 22l5.117-1.322a9.958 9.958 0 004.884 1.244h.004c5.522 0 9.999-4.477 9.999-10s-4.476-9.999-10.003-9.919zm0 18.15h-.003a8.13 8.13 0 01-4.144-1.133l-.297-.176-3.037.784.81-2.96-.194-.304a8.128 8.128 0 01-1.245-4.36c0-4.49 3.655-8.144 8.147-8.144a8.09 8.09 0 015.762 2.386 8.09 8.09 0 012.384 5.762c-.001 4.49-3.655 8.145-8.183 8.145z" />
    </svg>
  );
}

export default function WhatsAppOrder({ producto }) {
  const tallasDisponibles = (producto.sizes || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [tallaSeleccionada, setTallaSeleccionada] = useState(
    tallasDisponibles[0] || ""
  );

  const numeroWhatsApp = "573192934969";

  function handleElegir() {
    const enlace =
      typeof window !== "undefined" ? window.location.href : "";

    const mensaje = `¡Hola! 👋 Me enamoré de este par en *VANDAL* y ya sé cuál quiero:\n\n👟 *${producto.name}*\n📏 Talla: *${tallaSeleccionada}*\n🔗 ${enlace}\n\n¿Me confirmas disponibilidad y cómo continúo con la compra?`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (tallasDisponibles.length === 0) {
    return (
      <p className="text-sm font-medium text-accent2">
        Sin tallas disponibles por ahora.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">
          Elige tu talla
        </p>
        <div className="flex flex-wrap gap-2">
          {tallasDisponibles.map((talla) => (
            <button
              key={talla}
              type="button"
              onClick={() => setTallaSeleccionada(talla)}
              className={`h-11 w-11 rounded-lg border text-sm font-semibold transition ${
                tallaSeleccionada === talla
                  ? "border-accent bg-accent text-bg"
                  : "border-border text-ink hover:border-accent hover:text-accent"
              }`}
            >
              {talla}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleElegir}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3 text-[15px] font-semibold text-white transition hover:brightness-95"
      >
        <WhatsAppIcon />
        Elegir por WhatsApp
      </button>
      <p className="text-xs text-muted">
        Te abrimos WhatsApp con tu talla y este producto ya listos para enviar.
      </p>
    </div>
  );
}
