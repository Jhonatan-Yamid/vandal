import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            VANDAL
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/#catalogo"
            className="hidden text-[15px] font-medium text-muted transition hover:text-ink sm:block"
          >
            Catálogo
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border px-4 py-2 text-[14px] font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
