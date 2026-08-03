import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Política de Privacidad — VANDAL",
  description: "Política de privacidad de la tienda VANDAL.",
};

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-extrabold text-ink">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-muted">
          Última actualización: {new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-ink">
          <section>
            <h2 className="mb-2 font-display text-xl font-bold text-ink">
              1. Quiénes somos
            </h2>
            <p>
              VANDAL es una tienda virtual de calzado deportivo. Esta política
              describe qué información recopilamos a través de nuestro sitio
              web y de nuestros canales de contacto, incluyendo WhatsApp, y
              cómo la utilizamos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-bold text-ink">
              2. Información que recopilamos
            </h2>
            <p>
              Cuando navegas nuestro catálogo no recopilamos datos personales.
              Cuando nos contactas por WhatsApp para consultar o elegir un
              producto, recibimos tu número de teléfono, el contenido de tu
              mensaje y, si aplica, el producto y talla que nos indiques.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-bold text-ink">
              3. Uso de WhatsApp Business Platform
            </h2>
            <p>
              Utilizamos la API oficial de WhatsApp (Meta) para recibir y
              responder mensajes de nuestros clientes y proveedores. La
              información compartida por este medio se usa exclusivamente
              para gestionar pedidos, dar soporte y actualizar nuestro
              catálogo interno. No compartimos esta información con terceros
              con fines publicitarios.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-bold text-ink">
              4. Conservación de datos
            </h2>
            <p>
              Conservamos la información de contacto y de pedidos únicamente
              el tiempo necesario para gestionar la relación comercial
              contigo. Puedes solicitar la eliminación de tus datos
              escribiéndonos por WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-bold text-ink">
              5. Contacto
            </h2>
            <p>
              Si tienes preguntas sobre esta política o sobre el manejo de tu
              información, puedes escribirnos directamente por WhatsApp desde
              el botón de contacto en la ficha de cada producto.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
