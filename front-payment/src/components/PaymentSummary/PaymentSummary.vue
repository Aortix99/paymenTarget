<template>
  <div class="payment-summary">
    <div class="payment-summary__product">
      <span class="payment-summary__product-name">{{ productName }}</span>
      <span class="payment-summary__product-price">{{ formatPrice(productPrice) }}</span>
    </div>
    <div class="payment-summary__line">
      <span>Cargo base</span>
      <span>{{ formatPrice(baseCharge) }}</span>
    </div>
    <div class="payment-summary__line">
      <span>Costo de envío</span>
      <span>{{ formatPrice(shippingCost) }}</span>
    </div>
    <div class="payment-summary__total">
      <span>Total</span>
      <span>{{ formatPrice(totalAmount) }}</span>
    </div>
  </div>
</template>

<script src="./PaymentSummary.js"></script>
<style src="./PaymentSummary.css" scoped></style>
