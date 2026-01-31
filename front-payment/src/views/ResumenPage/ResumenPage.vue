<template>
  <main class="resumen-page">
    <div class="resumen-page__container">
      <PageHeader title="Resumen del pago" @back="goBack" />

      <BackdropModal :show="true" title="Resumen del pago">
        <PaymentSummary
          :product-name="product.name"
          :product-price="product.price"
          :base-charge="baseCharge"
          :shipping-cost="shippingCost"
          :total-amount="totalAmount"
          :format-price="formatPrice"
        />
        <p class="resumen-page__note">
          Al confirmar, se creará una transacción y se procesará el pago con Wompi.
        </p>
        <div class="resumen-page__actions">
          <button
            type="button"
            class="resumen-page__btn resumen-page__btn--primary"
            :disabled="loading"
            @click="confirmPayment"
          >
            {{ loading ? 'Procesando...' : 'Pagar' }}
          </button>
          <!-- <button type="button" class="resumen-page__btn resumen-page__btn--secondary" @click="goToProduct">
            Cancelar
          </button> -->
        </div>
        <p v-if="errorMessage" class="resumen-page__error">{{ errorMessage }}</p>
      </BackdropModal>
    </div>
  </main>
</template>

<script src="./ResumenPage.js"></script>
<style src="./ResumenPage.css" scoped></style>
