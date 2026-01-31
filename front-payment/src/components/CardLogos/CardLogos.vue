<template>
  <div class="card-logos" aria-hidden="true">
    <span
      class="card-logos__item card-logos__item--visa"
      :class="{ 'card-logos__item--active': brand === 'visa' }"
      title="VISA"
    >VISA</span>
    <span
      class="card-logos__item card-logos__item--mastercard"
      :class="{ 'card-logos__item--active': brand === 'mastercard' }"
      title="Mastercard"
    >MC</span>
  </div>
</template>

<script src="./CardLogos.js"></script>
<style src="./CardLogos.css" scoped></style>
