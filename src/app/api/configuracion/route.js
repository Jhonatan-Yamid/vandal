import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getConfiguracion } from "@/lib/config";

export async function GET() {
  const config = await getConfiguracion();
  return NextResponse.json(config);
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { priceMarkupPercent, productMaxAgeDays } = body;

  const porcentaje = Number(priceMarkupPercent);
  if (!Number.isInteger(porcentaje) || porcentaje < 0) {
    return NextResponse.json(
      { error: "El porcentaje debe ser un número entero mayor o igual a 0" },
      { status: 400 }
    );
  }

  let dias = null;
  if (productMaxAgeDays !== null && productMaxAgeDays !== "" && productMaxAgeDays !== undefined) {
    dias = Number(productMaxAgeDays);
    if (!Number.isInteger(dias) || dias <= 0) {
      return NextResponse.json(
        { error: "Los días deben ser un número entero mayor a 0 (o déjalo vacío para desactivar)" },
        { status: 400 }
      );
    }
  }

  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { priceMarkupPercent: porcentaje, productMaxAgeDays: dias },
    create: { id: 1, priceMarkupPercent: porcentaje, productMaxAgeDays: dias },
  });

  return NextResponse.json(config);
}
