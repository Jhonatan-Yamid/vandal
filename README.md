# VOLTAGE — Tienda de Tenis

Tienda virtual de tenis construida con **Next.js 14 (App Router) + Tailwind CSS + Prisma (MySQL)**.
El backend vive en el propio API de Next.js (`src/app/api/**`), sin servidor externo.

## Funcionalidades

- **Home pública** con jumbotron de producto destacado, catálogo con filtro por categoría y detalle de producto con tallas disponibles.
- **Login de administrador** (`/login`) con NextAuth (credenciales, sesión JWT).
- **Panel admin** (`/admin`, protegido por middleware) con CRUD completo de:
  - Productos (nombre, marca, descripción, precio, imagen, stock, tallas, categoría).
  - Categorías.
- **Imágenes de producto en Cloudinary**: al crear o editar un producto, la imagen se sube automáticamente a Cloudinary y la URL resultante se guarda en la base de datos.

## 1. Requisitos

- Node.js 18+
- Una base de datos MySQL accesible (local o remota)
- Una cuenta gratuita de Cloudinary (para las imágenes de producto)

## 2. Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` con tus datos reales:

```
DATABASE_URL="mysql://usuario:password@localhost:3306/tienda_tenis"
NEXTAUTH_SECRET="genera-uno-con: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@tienda.com"
ADMIN_PASSWORD="tu-password-seguro"
ADMIN_NAME="Administrador"
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

## 3. Cloudinary (imágenes de productos)

Las imágenes de producto se suben a Cloudinary desde el panel admin (no se guardan en el servidor).

1. Crea una cuenta gratuita en https://cloudinary.com
2. En el Dashboard copia: **Cloud name**, **API Key** y **API Secret**
3. Pégalos en tu `.env` como se muestra arriba

Al crear o editar un producto en `/admin/productos`, el campo de imagen sube el archivo automáticamente a la carpeta `tienda-tenis/productos` de tu cuenta de Cloudinary vía la ruta protegida `POST /api/upload`, y guarda la URL resultante (`secure_url`) en el campo `imageUrl` del producto. El catálogo público, el jumbotron y el detalle de producto cargan esa URL directamente con `next/image`.

Formatos admitidos: JPG, PNG, WEBP, AVIF · tamaño máximo 8MB por imagen.

## 4. Base de datos

Crea las tablas en MySQL a partir del `schema.prisma`:

```bash
npx prisma migrate dev --name init
```

Esto también genera el cliente de Prisma. Si solo necesitas regenerarlo:

```bash
npx prisma generate
```

> Si tu proveedor de hosting no te da permisos para crear bases de datos (error `P3014`, típico en hosting compartido), usa en su lugar:
> ```bash
> npx prisma db push
> ```

## 5. Sembrar datos iniciales (admin + categorías + productos demo)

```bash
npm run seed
```

Esto crea:
- Un usuario administrador con el email/contraseña definidos en `.env`.
- 5 categorías (Running, Basketball, Casual, Skate, Training).
- 6 productos de ejemplo con imágenes de Unsplash (solo para el seed inicial; los productos que crees desde el panel usarán Cloudinary).

## 6. Ejecutar en desarrollo

```bash
npm run dev
```

- Catálogo: http://localhost:3000
- Login admin: http://localhost:3000/login
- Panel admin: http://localhost:3000/admin (redirige a login si no hay sesión)

## 7. Producción

```bash
npm run build
npm start
```

## Estructura relevante

```
prisma/schema.prisma        Modelos: Category, Product, Admin
prisma/seed.js               Script de datos iniciales
src/lib/prisma.js            Cliente único de Prisma
src/lib/auth.js               Configuración de NextAuth
src/middleware.js             Protege /admin/* (redirige a /login)
src/app/page.js               Home: jumbotron + catálogo público
src/app/producto/[id]/        Detalle de producto
src/app/login/                Login admin
src/app/admin/                Panel admin (productos, categorías)
src/app/api/productos/        API REST de productos (GET público, POST/PUT/DELETE protegidos)
src/app/api/categorias/       API REST de categorías (GET público, POST/PUT/DELETE protegidos)
src/app/api/upload/           Sube imágenes a Cloudinary (protegido, solo admin)
src/components/               Navbar, ProductHero, ProductCard, SizeRun, ProductForm, ProductTable, CategoryManager
```

## Notas de diseño

- Modo claro con acento dominante `#00A3BF` (teal) y coral `#FF5A5F` para alertas/agotado, tipografía display `Plus Jakarta Sans` + cuerpo `Inter`.
- El jumbotron (`ProductHero`) muestra el producto más reciente como destacado, con una franja de miniaturas de otros productos.
- El componente `SizeRun` (escala de tallas 35–46) es el elemento visual distintivo: se repite en catálogo, detalle y formulario de producto, reflejando el tallaje real de calzado.
- Todo el código está en JavaScript (no TypeScript), tal como se solicitó.

## Notas de seguridad para producción

- Cambia `ADMIN_PASSWORD` y `NEXTAUTH_SECRET` antes de desplegar.
- Las rutas de escritura de la API (`POST`, `PUT`, `DELETE`, `/api/upload`) verifican sesión de admin vía `getServerSession`.
- Considera agregar un panel para crear/gestionar más de un usuario admin si lo necesitas (actualmente se crea vía `seed.js`).
