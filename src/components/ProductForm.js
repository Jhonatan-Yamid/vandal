"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TALLAS_DISPONIBLES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

export default function ProductForm({ producto }) {
  const router = useRouter();
  const esEdicion = Boolean(producto);

  const [form, setForm] = useState({
    name: producto?.name || "",
    brand: producto?.brand || "",
    description: producto?.description || "",
    price: producto?.price || "",
    imageUrl: producto?.imageUrl || "",
    stock: producto?.stock ?? 0,
  });
  const [tallasElegidas, setTallasElegidas] = useState(
    new Set(
      (producto?.sizes || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number)
    )
  );
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(producto?.imageUrl || "");

  function toggleTalla(talla) {
    setTallasElegidas((prev) => {
      const next = new Set(prev);
      if (next.has(talla)) next.delete(talla);
      else next.add(talla);
      return next;
    });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setPreviewUrl(URL.createObjectURL(file));
    setSubiendoImagen(true);

    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo subir la imagen.");
        setPreviewUrl(form.imageUrl || "");
        return;
      }

      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      setPreviewUrl(data.url);
    } catch (err) {
      setError("No se pudo subir la imagen. Revisa tu conexión e intenta de nuevo.");
      setPreviewUrl(form.imageUrl || "");
    } finally {
      setSubiendoImagen(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (tallasElegidas.size === 0) {
      setError("Selecciona al menos una talla disponible.");
      return;
    }

    if (subiendoImagen) {
      setError("Espera a que termine de subirse la imagen.");
      return;
    }

    if (!form.imageUrl) {
      setError("Sube una imagen del producto.");
      return;
    }

    setCargando(true);
    const payload = {
      ...form,
      name: form.name.toUpperCase(),
      price: Number(form.price),
      stock: Number(form.stock),
      sizes: Array.from(tallasElegidas).sort((a, b) => a - b).join(","),
    };

    const url = esEdicion ? `/api/productos/${producto.id}` : "/api/productos";
    const method = esEdicion ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setCargando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Ocurrió un error al guardar.");
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Nombre *
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Marca
          </label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-muted">
          Descripción *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Precio (COP) *
          </label>
          <input
            name="price"
            type="number"
            min="0"
            step="100"
            required
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Existencias *
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-muted">
          Imagen del producto *
        </label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-surface2">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Vista previa"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                Sin imagen
              </div>
            )}
            {subiendoImagen && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg/70 text-xs font-medium text-ink">
                Subiendo...
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              className="w-full cursor-pointer rounded-md border border-border bg-surface2 px-3 py-2 text-sm text-ink outline-none file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-bg focus:border-accent"
            />
            <p className="text-xs text-muted">
              JPG, PNG, WEBP o AVIF · máx. 8MB. Se sube automáticamente a Cloudinary.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted">
          Tallas disponibles *
        </label>
        <div className="flex flex-wrap gap-2">
          {TALLAS_DISPONIBLES.map((talla) => {
            const activo = tallasElegidas.has(talla);
            return (
              <button
                type="button"
                key={talla}
                onClick={() => toggleTalla(talla)}
                className={`h-10 w-10 rounded-md border text-sm font-semibold transition ${
                  activo
                    ? "border-accent bg-accent text-bg"
                    : "border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {talla}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-accent2/40 bg-accent2/10 px-3 py-2 text-sm text-accent2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={cargando || subiendoImagen}
          className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-bg transition hover:bg-ink disabled:opacity-50"
        >
          {cargando
            ? "Guardando..."
            : subiendoImagen
            ? "Subiendo imagen..."
            : esEdicion
            ? "Guardar cambios"
            : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/productos")}
          className="rounded-full border border-border px-6 py-3 text-[15px] font-semibold text-ink transition hover:border-accent2 hover:text-accent2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
