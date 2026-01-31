<template>
  <main class="resultado-page">
    <div class="resultado-page__card">
      <div v-if="isApproved" class="resultado-page__icon resultado-page__icon--success" aria-hidden="true">
        ✓
      </div>
      <div v-else-if="isDeclined" class="resultado-page__icon resultado-page__icon--error" aria-hidden="true">
        ✕
      </div>
      <div v-else class="resultado-page__icon resultado-page__icon--pending" aria-hidden="true">⋯</div>

      <h1 class="resultado-page__title">
        {{ isApproved ? 'Pago exitoso' : isDeclined ? 'Pago rechazado' : 'Procesando...' }}
      </h1>
      <p class="resultado-page__message">
        <template v-if="isApproved">
          Tu transacción se completó correctamente. El producto será enviado a la dirección indicada.
        </template>
        <template v-else-if="isDeclined">
          No pudimos procesar tu pago. Verifica los datos de la tarjeta e intenta de nuevo.
        </template>
        <template v-else>
          Espera un momento mientras confirmamos tu pago.
        </template>
      </p>
      <p v-if="transactionId" class="resultado-page__id">
        Nº de transacción: {{ transactionId }}
      </p>
      <button type="button" class="resultado-page__btn" @click="goToProduct">
        Volver al producto
      </button>
    </div>
  </main>
</template>

<script src="./ResultadoPage.js"></script>
<style src="./ResultadoPage.css" scoped></style>
