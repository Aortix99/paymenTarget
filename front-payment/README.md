# Front Payment (Vue 3 SPA)

## 1. Descripción general del proyecto

**Aplicación SPA** que permite a un usuario **comprar un producto** usando **tarjeta de crédito ficticia** en entorno **sandbox**, procesando el pago mediante la pasarela **Wompi**, con gestión de transacciones, stock y datos de entrega.

Resuelve el flujo de negocio de una tienda mínima: ver producto → ingresar datos de tarjeta y entrega → ver resumen → pagar → ver resultado y volver al listado con stock actualizado.

---

## 2. Flujo de negocio (5 pantallas)

| Paso | Pantalla | Ruta | Descripción |
|-----|----------|------|-------------|
| 1 | **Product Page** | `/` | Lista/card del producto, precio, stock, botón "Pagar con tarjeta de crédito". |
| 2 | **Credit Card + Delivery Info** | `/checkout` | Formularios: tarjeta (VISA/MasterCard) y datos de entrega (país, ciudad, dirección, nombre, documento, email) con validaciones. |
| 3 | **Payment Summary** | `/resumen` | Resumen en backdrop: valor producto, cargo base, costo de envío, total. Botón "Pagar". |
| 4 | **Payment Result** | `/resultado` | Estado final (éxito o rechazo). Botón "Volver al producto". |
| 5 | **Product Page (stock updated)** | `/` | Misma página de producto; el stock se actualiza al recargar (GET `/products` desde el backend). |

Flujo lineal: **Producto → Checkout → Resumen → Resultado → Producto**.

---

## 3. Tecnologías usadas

| Área | Tecnología |
|------|------------|
| **Runtime** | Node.js **v20.19.5** (recomendado `^20.19.0` o `>=22.12.0`) |
| **Framework** | **Vue 3** (SPA) |
| **API de componentes** | **Composition API** |
| **State management** | **Vuex 4** |
| **Router** | **Vue Router 4** |
| **Build** | **Vite** 7.x |
| **Estilos** | CSS con variables, **mobile first** (referencia mínima ~375px) |
| **Persistencia** | **localStorage** (estado del checkout para recuperar progreso al recargar) |
| **Testing** | **Vitest** + **@vue/test-utils**, cobertura con **@vitest/coverage-v8** |

---

## 4. Arquitectura (por capas, componentes, Composition API)

### 4.1 Organización general

- **Vistas (Views):** una por paso del flujo (`ProductPage`, `CheckoutPage`, `ResumenPage`, `ResultadoPage`). Cada vista puede usar varios componentes y composables.
- **Componentes:** UI reutilizable (por ejemplo `ProductCard`, `CardForm`, `DeliveryForm`, `PaymentSummary`, `PageHeader`, `BackdropModal`). Cada uno puede tener su `.vue`, `.js` (lógica/helpers) y `.css`.
- **Composables (Composition API):** lógica reutilizable y estado local asociado al flujo (`useProducts`, `useCardForm`, `useDeliveryForm`, `usePayment`, `useResultado`). Se usan dentro de vistas y componentes.
- **Capa de datos:** `store` (Vuex) para estado global; `api/` para llamadas HTTP al backend y a Wompi (tokenización).

### 4.2 Capas

| Capa | Ubicación | Responsabilidad |
|------|-----------|------------------|
| **Vistas** | `src/views/` | Páginas por paso del flujo; orquestan componentes y composables. |
| **Componentes** | `src/components/` | UI (formularios, cards, resumen, header, modal). |
| **Composables** | `src/composables/` | Lógica y estado reutilizable (Composition API). |
| **Estado global** | `src/store/` | Vuex: productos, producto seleccionado, formularios de tarjeta/entrega, `transactionId`, `transactionStatus`, paso actual. |
| **API / servicios** | `src/api/` | `getProducts`, `postPayment`, `validateCard` (backend); `servicioWompi.js` (tokenización Wompi). |
| **Router** | `src/router/` | Rutas y meta (ej. `step`) para el flujo de 5 pasos. |
| **Utilidades** | `src/utils/` | Validaciones (ej. tarjeta en `cardValidation.js`). |

### 4.3 Composition API

Se aplica **Composition API** de Vue 3 en:

- **Composables:** `useProducts`, `useCardForm`, `useDeliveryForm`, `usePayment`, `useResultado` (ref, reactive, computed, funciones expuestas).
- **Componentes y vistas:** uso de `setup()` y/o `<script setup>` donde corresponda, consumiendo estos composables y el store.

Con esto se centraliza lógica reutilizable y se mantiene una estructura por capas (vistas → componentes → composables → store/api).

### 4.4 Resiliencia (estado tras refresh)

- El **store de Vuex** se persiste en **localStorage** mediante un plugin que hace `saveState(state)` en cada mutación.
- Al cargar la app se puede llamar a `restoreFromStorage` para recuperar producto, formularios, `transactionId`, `transactionStatus` y paso, permitiendo retomar el flujo tras recargar la página.

---

## 5. Modelo de datos (estado y API)

### 5.1 Estado global (Vuex)

- **products:** lista desde `GET /products`.
- **product:** objeto seleccionado (`id`, `name`, `description`, `price`, `stock`, `img`).
- **cardForm:** `number`, `holder`, `expiry`, `cvc`.
- **deliveryForm:** `country`, `city`, `address`, `fullName`, `document`, `email`.
- **transactionId**, **transactionStatus**, **step.**

Getters: `baseCharge`, `shippingCost`, `totalAmount`, `canRecoverProgress`, `cardBrand`.

### 5.2 Endpoints consumidos (backend)

| Método | Ruta | Uso en front |
|--------|------|-------------------------------|
| GET | `/products` | Listar productos y mostrar stock. |
| POST | `/transactions` | Crear transacción (PENDING) con datos de entrega. |
| POST | `/transactions/validate-card` | Validar tarjeta y procesar pago (backend habla con Wompi). |

### 5.3 Modelos para enviar (para documentar / Postman)

Puedes completar aquí los **cuerpos exactos** que envía el front para cada endpoint.

#### POST `/transactions`

Cuerpo que envía el front (ajustar según tu `postPayment`):

```json
{
  "reference": "string",
  "amount": 0,
  "status": "string",
  "wompiTransactionId": "string",
  "productId": 0,
  "delivery": {
    "country": "string",
    "city": "string",
    "address": "string",
    "fullName": "string",
    "document": "string",
    "email": "string"
  }
}
```

#### POST `/transactions/validate-card`

Cuerpo que envía el front (según `validateCard` y payload Wompi):

```json
{
  "validateCard": { "type": "CARD", "token": "...", "customer_email": "...", "acceptance_token": "...", "accept_personal_auth": "..." },
  "amount": 0,
  "idTransaction": 0,
  "idPrroduct": 0
}
```

*(Ajustar nombres de campos si en el código se usa `idProduct` u otro.)*

---

## 6. Seguridad

- **No se almacenan datos de tarjetas**; se usa tokenización vía Wompi (sandbox) desde el front.
- Uso de **variables de entorno** (`VITE_*`) para URL del API, URL Wompi y clave pública (nunca claves privadas en el front).
- Comunicación con backend y Wompi en entorno **sandbox**; datos sensibles solo en memoria durante el flujo.

---

## 7. Testing

- **Herramientas:** Vitest, @vue/test-utils, jsdom, @vitest/coverage-v8.
- **Comandos (desde `package.json`):**
  - `npm run test` — tests (Vitest, run once, verbose).
  - `npm run coverage` — tests con cobertura (`vitest run --coverage`).

**Cobertura:** el frontend tiene **tests con cobertura al 86%**; solo quedaron pendientes algunos **branches** (ramas de código) por cubrir.

Para ver el reporte:

```bash
npm run coverage
```

La cobertura se genera con el provider `v8`; reportes en `text`, `json` y `html` (ver `vite.config.js`).

---

## 8. Despliegue

Completa con tus URLs reales:

- **Frontend desplegado:** `http://paycard0202.s3-website.us-east-2.amazonaws.com/`


**Script de deploy (package.json):** `npm run deploy` → `npm run build && aws s3 sync ./dist s3://paycard0202`

---

## 9. Cómo correr el proyecto localmente

**Requisitos:** Node.js **v20.19.5** (o compatible), npm.

1. **Instalar dependencias**

```bash
cd front-payment
npm install
```

2. **Variables de entorno**

Crea `.env` o `.env.local` en la raíz del front (ejemplo basado en tu `.env`):

```env
VITE_PUBLIC_KEY=pub_stagtest_...
VITE_URL_WOMPI=https://api-sandbox.co.uat.wompi.dev/v1/
VITE_API_URL=http://localhost:3000/
```

- `VITE_API_URL`: URL base del backend (sin path `/products` ni `/transactions`; el código concatena el path).
- Para producción, cambia `VITE_API_URL` por la URL de tu API desplegada.

3. **Ejecutar**

```bash
# Desarrollo (hot reload)
npm run dev
```

La app quedará en `http://localhost:5173` (o el puerto que muestre Vite). Asegúrate de que el backend esté en marcha en la URL indicada en `VITE_API_URL`.

4. **Build y preview**

```bash
npm run build
npm run preview
```

---

## 10. Scripts disponibles (package.json)

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `vite` | Servidor de desarrollo con HMR |
| `build` | `vite build` | Build de producción (carpeta `dist`) |
| `preview` | `vite preview` | Sirve el build localmente |
| `test` | `vitest run --reporter=verbose --silent=false` | Tests una vez |
| `coverage` | `vitest run --coverage` | Tests con reporte de cobertura |
| `deploy` | `npm run build && aws s3 sync ./dist s3://paycard0202` | Build y subida a S3 |

---

## 11. Uso de IA

This project used AI tools as a coding assistant for:

- Code structure (capas, componentes, composables)
- Test coverage improvements
- Validation and form logic
- README and documentation drafting

---

## Resumen

- **Proyecto:** SPA de compra de producto con pago por tarjeta (sandbox) e integración Wompi.
- **Stack:** Vue 3, Composition API, Vuex 4, Vue Router 4, Vite, TypeScript/JS.
- **Arquitectura:** Por capas (vistas, componentes, composables, store, api); Composition API para lógica reutilizable.
- **Node:** v20.19.5.
- **Tests:** Vitest; cobertura 86% (algunos branches pendientes).
- **Persistencia:** localStorage para recuperar estado del checkout al recargar.
