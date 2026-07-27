"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setCargando(false);

    if (res?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center font-display text-2xl font-extrabold text-ink">
          Vandal
        </Link>

        <div className="rounded-xl border border-border bg-surface p-8">
          <h1 className="mb-1 font-display text-2xl font-bold text-ink">Acceso admin</h1>
          <p className="mb-6 text-sm text-muted">
            Ingresa tus credenciales para gestionar el catálogo.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Correo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
                placeholder="admin@tienda.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-surface2 px-3 py-2 text-ink outline-none focus:border-accent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-md border border-accent2/40 bg-accent2/10 px-3 py-2 text-sm text-accent2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="mt-2 rounded-full bg-accent px-4 py-2 text-[15px] font-semibold text-bg transition hover:bg-ink disabled:opacity-50"
            >
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
