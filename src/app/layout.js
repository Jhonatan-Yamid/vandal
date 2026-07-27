import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Vandal — Tienda de Tenis",
  description: "Catálogo de tenis: running, basketball, casual, skate y training.",
  manifest: "/manifest.json",
  themeColor: "#00A3BF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vandal",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-bg text-ink min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
