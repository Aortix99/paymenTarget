# Backend Paymen (Arquitectura Hexagonal)

## 1. Descripción general del proyecto

API REST que soporta una **aplicación de compra de productos** con pago por tarjeta de crédito en entorno **sandbox**. Resuelve:

- Exposición de catálogo de productos y stock.
- Creación de transacciones (estado PENDING) y validación de tarjeta contra la pasarela **Wompi** (sandbox).
- Registro de cliente y datos de entrega.
- Actualización de transacción (APPROVED/DECLINED) y **actualización de stock** cuando el pago es aprobado.

**Flujo de negocio:** el frontend consulta productos, el usuario completa datos de tarjeta y entrega, se valida la tarjeta con Wompi, se crea la transacción en BD, se procesa el pago y, si es aprobado, se decrementa el stock del producto.

---

## 2. Flujo de negocio (5 pantallas)

| Paso | Pantalla              | Rol del backend                                                                 |
|------|------------------------|----------------------------------------------------------------------------------|
| 1    | **Product Page**       | `GET /products` — listar productos con precio y stock                          |
| 2    | **Credit Card + Delivery** | Frontend recolecta datos; validación de tarjeta vía `POST /transactions/validate-card` |
| 3    | **Payment Summary**    | Frontend muestra resumen; puede crear transacción con `POST /transactions`      |
| 4    | **Payment Result**    | Backend actualiza transacción y stock según respuesta de Wompi (polling/consulta) |
| 5    | **Product Page (stock updated)** | Mismo `GET /products` con stock ya decrementado                            |

---

## 3. Tecnologías usadas

| Área       | Tecnología |
|-----------|------------|
| **Runtime** | Node.js **v20.19.5** (recomendado `^20.19.0` o `>=22.12.0`) |
| **Framework** | **NestJS** 11.x |
| **Lenguaje** | **TypeScript** 5.x |
| **ORM**   | TypeORM 0.3.x |
| **Base de datos** | PostgreSQL (vía `DATABASE_URL`) |
| **Pasarela** | Wompi API (sandbox) — axios |
| **Testing** | Jest (unit + e2e), coverage con `jest --coverage` |

---

## 4. Arquitectura (Hexagonal — Ports & Adapters)

El backend sigue **Arquitectura Hexagonal** (Ports and Adapters):

- **Dominio (core):** entidades y contratos (repositorios) sin dependencias de framework.
- **Application (casos de uso):** orquestan dominio e infraestructura inyectada.
- **Infrastructure (adapters):** controladores HTTP (NestJS), TypeORM (PostgreSQL), cliente HTTP a Wompi.

**Capas:**

| Capa | Ubicación | Responsabilidad |
|------|-----------|------------------|
| **Domain** | `src/domain/` | Entidades (`Product`, `Transactions`, `Customer`, `Delivery`) e interfaces de repositorios. Sin lógica de infraestructura. |
| **Application** | `src/application/` | Casos de uso: `ProductGetAll`, `TransactionsSave`. Contienen la lógica de negocio (crear transacción, cliente, entrega, actualizar transacción, decrementar stock). |
| **Infrastructure** | `src/infrastructure/` | **Adapters:** controladores NestJS (solo reciben request y delegan en use cases), entidades TypeORM, implementaciones de repositorios (TypeORM, Wompi API). |

**Importante:** La lógica de negocio **no** está en los controladores; está en los **Application (use cases)**. Los controladores solo mapean DTOs y llaman al caso de uso inyectado.

**Estructura de carpetas:**

```
src/
├── domain/           # Entidades + interfaces (ports)
├── application/      # Use cases (orquestación)
├── infrastructure/
│   ├── product/      # nestJs (controller), typeOrm (entity, repository)
│   ├── transactions/# nestJs (controller), typeOrm (entity, repository)
│   ├── customer/     # typeOrm (entity, repository)
│   └── delivery/     # typeOrm (entity, repository)
├── app.module.ts
└── main.ts
```

---

## 5. Modelo de datos

Entidades principales (TypeORM / PostgreSQL):

| Entidad | Tabla | Campos principales |
|---------|--------|--------------------|
| **Product** | `products` | `id`, `name`, `description`, `img`, `price`, `stock`, `createdAt` |
| **Transaction** | `transactions` | `id`, `reference`, `amount`, `status` (PENDING, APPROVED, DECLINED), `wompiTransactionId`, `productId`, `customerId`, `deliveryId`, `createdAt` |
| **Customer** | `customer` | `id`, `fullName`, `document`, `email` |
| **Delivery** | `delivery` | `id`, `address`, `city`, `country` |

Relaciones: una **Transaction** referencia un `productId`, un `customerId` y un `deliveryId`.

---

## 6. Endpoints del Backend

Base URL (local): `http://localhost:3000` (configurable con `PORT`, por defecto 3000).

### 6.1 Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| **GET** | `/products` | Lista todos los productos (id, name, description, img, price, stock, createdAt). |

**Respuesta ejemplo:** array de objetos con los campos del DTO (incl. `createdAt` en ISO string).

---

### 6.2 Transacciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| **POST** | `/transactions` | Crea una transacción (PENDING) y registra cliente/entrega si no existen. Devuelve `{ transactionId }`. |
| **POST** | `/transactions/validate-card` | Valida tarjeta con Wompi, crea transacción en Wompi, espera resultado, actualiza transacción y stock si APPROVED. |

---

### 6.3 Cuerpos de request (para documentar / Postman)

A continuación puedes completar los **cuerpos de ejemplo** y los **modelos** que debes enviar en cada endpoint.

#### POST `/transactions`

Cuerpo esperado (JSON):

```json
{
    "reference": "probando",
    "amount": 100000,
    "status": "PENDING",
    "wompiTransactionId": 0,
    "productId": 1,
    "delivery": {
        "country": "colombia",
        "city": "Barranquilla",
        "address": "mz B lt 6",
        "fullName": "Juanito Prez",
        "document": "1003435555",
        "email": "acocogollo@gmail.com"
    }
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `reference` | string | Referencia del pago |
| `amount` | number | Monto (ej. en centavos según Wompi) |
| `status` | string | Ej. "PENDING" |
| `wompiTransactionId` | string | ID de transacción en Wompi |
| `productId` | number | ID del producto |
| `delivery` | object | Datos de entrega y datos de facturación/cliente |

---

#### POST `/transactions/validate-card`

Cuerpo esperado (JSON) — según dominio `Payload`:

```json
{
  "validateCard": {
    "type": "CARD",
    "token": "string",
    "customer_email": "string",
    "acceptance_token": "string",
    "accept_personal_auth": "string"
  },
  "amount": 0,
  "idTransaction": 0,
  "idPrroduct": 0
}
```

*(Ajustar nombres exactos según tu DTO si `idPrroduct` es typo de `idProduct`.)*

---

### 6.4 Documentación API (Swagger)

```markdown
- Colección Postman: https://.postman.co/workspace/My-Workspace~37e10bb2-4554-48e4-8816-7174253818b6/request/34450025-89ece30d-9b3f-45ae-aa2c-397bb7823392?action=share&creator=34450025

---

## 7. Seguridad

- **No se almacenan datos de tarjetas**; se usa tokenización vía Wompi (sandbox).
- Uso de **variables de entorno** para `DATABASE_URL`, `WOMPI_BASE_URL`, `WOMPI_PRIVATE_KEY`, `INTEGIT_KEY` (firma), `PORT`.
- Comunicación con Wompi en entorno **sandbox**; credenciales nunca en código.
- CORS configurado en `main.ts` (orígenes permitidos para front local y S3).

---

## 8. Testing

- **Herramienta:** Jest.
- **Comandos (desde `package.json`):**
  - `npm run test` — tests unitarios
  - `npm run test:cov` / `npm run coverage` — cobertura
  - `npm run test:e2e` — e2e con `jest-e2e.json`
- **Cobertura:** el backend tiene **tests con cobertura al 100%** (según configuración de `collectCoverageFrom` en `package.json`), excluyendo `main.ts`, `app.module.ts`, `app.service.ts` y archivos `*.spec.ts` / `*.e2e-spec.ts`.

Para ver el reporte:

```bash
npm run test
npm run coverage
```

El reporte se genera en la carpeta `coverage/`.

---

## 9. Webhook Wompi (no implementado)

**No está implementado el servicio de webhook de Wompi** para recibir el evento de pago (ej. `transaction.updated`). Motivo: no se dispone de permisos/credenciales adecuados en Wompi; las credenciales recibidas por correo no permitieron completar el login/configuración necesaria para exponer y verificar el webhook.  
El flujo actual actualiza la transacción y el stock mediante la respuesta síncrona de la API de Wompi (validación de pago y consulta de estado), no por callback

## 10. Despliegue

Completa con tus URLs reales:

- Backend EC2: http://ec2-3-22-81-33.us-east-2.compute.amazonaws.com:3000
- SUPRABASE  PostgreSQL

## 11. Cómo correr el proyecto localmente

**Requisitos:** Node.js **v20.19.5** (o compatible ^20.19.0 / >=22.12.0), npm, PostgreSQL.

1. **Clonar e instalar dependencias**

```bash
cd backend-paymen-hex
npm install
```

2. **Variables de entorno**

Crea un archivo `.env` en la raíz del backend (o configura en tu entorno):

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_bd
WOMPI_BASE_URL=https://api-sandbox.co.uat.wompi.dev/v1
WOMPI_PRIVATE_KEY=tu_private_key_sandbox
INTEGIT_KEY=tu_integrity_key_sandbox
```

3. **Base de datos**

- Tener PostgreSQL en ejecución.
- TypeORM está configurado con `synchronize: true` (crea/actualiza tablas al arrancar). Para producción se recomienda usar migraciones y desactivar `synchronize`.

4. **Seeds (opcional)**

Si tienes seeds para productos o datos iniciales, documenta aquí el comando (ej. `npm run seed`).

5. **Ejecutar**

```bash
# Desarrollo (watch)
npm run start:dev

# Producción (compilar y ejecutar)
npm run build
npm run start:prod
```

La API quedará en `http://localhost:3000` (o en el `PORT` definido).

---

## 12. Scripts disponibles (package.json)

| Script | Comando | Descripción |
|--------|---------|-------------|
| `build` | `nest build` | Compila el proyecto |
| `start` | `nest start` | Inicia la app (compilada) |
| `test` | `jest` | Tests unitarios |
| `test:cov` / `coverage` | `jest --coverage` | Tests con reporte de cobertura |
| `test:e2e` | `jest --config ./test/jest-e2e.json` | Tests e2e |
| `lint` | `eslint ...` | Linter |
| `format` | `prettier --write ...` | Formateo de código |

---

## Resumen

- **Proyecto:** API para compra de producto con pago por tarjeta (sandbox) e integración Wompi.
- **Arquitectura:** Hexagonal (domain, application, infrastructure) con NestJS y TypeScript.
- **Node:** v20.19.5.
- **Endpoints:** `GET /products`, `POST /transactions`, `POST /transactions/validate-card`.
- **Tests:** Jest; cobertura 100% en código cubierto por la configuración.
- **Webhook Wompi:** No implementado por falta de permisos/credenciales válidas.
