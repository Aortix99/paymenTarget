<template>
  <main class="checkout-page">
    <div class="checkout-page__container">
      <PageHeader title="Datos de pago y entrega" @back="goBack" />

      <form class="checkout-page__form" @submit.prevent="goToResumen">
        <CardForm ref="cardFormRef" />
        <DeliveryForm ref="deliveryFormRef" />
        <button type="submit" class="checkout-page__submit">
          Continuar al resumen
        </button>
      </form>
    </div>
  </main>
</template>

<script src="./CheckoutPage.js"></script>
<style src="./CheckoutPage.css" scoped></style>
