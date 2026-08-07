import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-display text-lg font-bold text-ink">
            VANDAL <span className="font-normal text-muted">/ admin</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/admin/productos"
              className="rounded-full px-4 py-2 text-[14px] font-medium text-muted transition hover:text-accent"
            >
              Productos
            </Link>
            <Link
              href="/admin/configuracion"
              className="rounded-full px-4 py-2 text-[14px] font-medium text-muted transition hover:text-accent"
            >
              Configuración
            </Link>
            <span className="mx-2 hidden text-sm text-muted sm:block">
              {session?.user?.name}
            </span>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
