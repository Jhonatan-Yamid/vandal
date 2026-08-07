import { getConfiguracion } from "@/lib/config";
import ConfiguracionForm from "@/components/ConfiguracionForm";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracion() {
  const config = await getConfiguracion();

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold text-ink">
        Configuración
      </h1>
      <p className="mb-6 text-sm text-muted">
        Ajustes generales del sitio y del bot de WhatsApp.
      </p>
      <ConfiguracionForm config={config} />
    </div>
  );
}
