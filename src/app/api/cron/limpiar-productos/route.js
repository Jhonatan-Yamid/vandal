import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConfiguracion } from "@/lib/config";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clave = searchParams.get("key");

  if (!process.env.CRON_SECRET || clave !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const config = await getConfiguracion();

  if (!config.productMaxAgeDays) {
    return NextResponse.json({
      ok: true,
      eliminados: 0,
      mensaje: "La limpieza automática está desactivada (no hay días configurados).",
    });
  }

  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - config.productMaxAgeDays);

  const resultado = await prisma.product.deleteMany({
    where: { createdAt: { lt: fechaLimite } },
  });

  return NextResponse.json({
    ok: true,
    eliminados: resultado.count,
    diasConfigurados: config.productMaxAgeDays,
    fechaLimite: fechaLimite.toISOString(),
  });
}
