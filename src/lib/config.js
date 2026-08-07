import { prisma } from "@/lib/prisma";

export async function getConfiguracion() {
  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, priceMarkupPercent: 0, productMaxAgeDays: null },
  });
  return config;
}

export async function obtenerCategoriaPorDefectoId() {
  const categoria = await prisma.category.upsert({
    where: { slug: "otro" },
    update: {},
    create: { name: "Otro", slug: "otro" },
  });
  return categoria.id;
}
