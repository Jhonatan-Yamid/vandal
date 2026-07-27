const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@tienda.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";
  const adminName = process.env.ADMIN_NAME || "Administrador";

  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: hashed, name: adminName },
  });
  console.log(`Admin listo -> ${adminEmail} / ${adminPassword}`);

  const categorias = ["Running", "Basketball", "Casual", "Skate", "Training"];
  const categoryRecords = {};
  for (const nombre of categorias) {
    const cat = await prisma.category.upsert({
      where: { slug: slugify(nombre) },
      update: {},
      create: { name: nombre, slug: slugify(nombre) },
    });
    categoryRecords[nombre] = cat;
  }
  console.log("Categorías listas");

  const productosCount = await prisma.product.count();
  if (productosCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "Nova Runner",
          brand: "Volt",
          description:
            "Zapatilla de running ligera con amortiguación de espuma reactiva, ideal para entrenamientos diarios y carreras de fondo.",
          price: 289900,
          imageUrl:
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
          stock: 24,
          sizes: "38,39,40,41,42,43",
          categoryId: categoryRecords["Running"].id,
        },
        {
          name: "Air Court High",
          brand: "Volt",
          description:
            "Tenis de basketball caña alta con soporte de tobillo reforzado y suela de tracción multidireccional.",
          price: 349900,
          imageUrl:
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
          stock: 15,
          sizes: "40,41,42,43,44,45",
          categoryId: categoryRecords["Basketball"].id,
        },
        {
          name: "Street Classic",
          brand: "Urbanwalk",
          description:
            "Diseño casual atemporal en cuero sintético, perfecto para el día a día con cualquier outfit.",
          price: 199900,
          imageUrl:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
          stock: 32,
          sizes: "36,37,38,39,40,41,42",
          categoryId: categoryRecords["Casual"].id,
        },
        {
          name: "Grind Deck",
          brand: "Ledge",
          description:
            "Zapatilla de skate con suela reforzada anti-abrasión y grip de alto agarre para trucos técnicos.",
          price: 229900,
          imageUrl:
            "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800",
          stock: 18,
          sizes: "39,40,41,42,43",
          categoryId: categoryRecords["Skate"].id,
        },
        {
          name: "Cross Trainer Pro",
          brand: "Volt",
          description:
            "Diseñada para entrenamiento funcional e HIIT, con base estable y transpirabilidad total.",
          price: 259900,
          imageUrl:
            "https://images.unsplash.com/photo-1608379743498-a621f4a5f3b1?w=800",
          stock: 20,
          sizes: "37,38,39,40,41,42,43",
          categoryId: categoryRecords["Training"].id,
        },
        {
          name: "Cloud Pace 2",
          brand: "Nimbus",
          description:
            "Segunda generación con entresuela de doble densidad para máxima suavidad en largas distancias.",
          price: 319900,
          imageUrl:
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
          stock: 10,
          sizes: "38,39,40,41,42",
          categoryId: categoryRecords["Running"].id,
        },
      ],
    });
    console.log("Productos de ejemplo creados");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
