<template>
  <article class="product-card">
    <div class="product-card__image">
      <img
        v-if="showImage(product)"
        :src="img"
        :alt="product.name"
        class="product-card__img"
        @error="onImageError(product.id)"
      />
      <span v-else class="product-card__placeholder">No hay productos</span>
    </div>
    <h2 class="product-card__title">{{ product.name }}</h2>
    <p class="product-card__description">{{ product.description }}</p>
    <div class="product-card__meta">
      <span class="product-card__price">{{ formatPrice(product.price) }}</span>
      <span class="product-card__stock">Stock: {{ stock }} unidades</span>
    </div>
    <button
      type="button"
      class="product-card__btn product-card__btn--primary"
      :disabled="stock <= 0"
      @click="emit('select', product)"
    >
      Pagar con tarjeta de crédito
    </button>
  </article>
</template>

<script src="./ProductCard.js"></script>
<style src="./ProductCard.css" scoped></style>
