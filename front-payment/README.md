# front-payment

SPA de pago con Wompi (Vue 3 + Vuex + Vue Router). Prueba técnica: flujo de 5 pantallas (producto → datos de tarjeta/entrega → resumen → resultado → producto).

## Estructura del flujo

1. **Página del producto** (`/`) – Producto, stock, precio, botón "Pagar con tarjeta de crédito".
2. **Checkout** (`/checkout`) – Formulario tarjeta (VISA/MasterCard) y datos de entrega con validaciones.
3. **Resumen** (`/resumen`) – Resumen en backdrop: valor producto, cargo base, costo de envío, botón Pagar.
4. **Resultado** (`/resultado`) – Estado final (éxito/rechazo) y botón "Volver al producto".
5. **Página del producto** – Stock actualizado (cuando el backend lo exponga).

## Tecnologías

- Vue 3 (Composition API)
- Vuex 4 (estado global, persistido en `localStorage` para recuperar progreso al recargar)
- Vue Router 4
- Vite
- CSS con variables (mobile-first, referencia mínima iPhone SE 375px)

## Variables de entorno

- `VITE_API_URL`: URL base del API (por defecto `http://localhost:3000/api`). Usar en `.env` o `.env.local`.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
