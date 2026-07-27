"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-muted transition hover:border-accent2 hover:text-accent2"
    >
      Cerrar sesión
    </button>
  );
}
