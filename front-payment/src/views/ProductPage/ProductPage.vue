<template>
  <main class="product-page">

    <p v-if="error" class="product-page__error">{{ error }}</p>
    <p v-if="loading" class="product-page__loading">Cargando productos...</p>

    <div v-else class="product-page__list">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        :format-price="formatPrice"
        :show-image="showProductImage"
        :on-image-error="onImageError"
        @select="selectProduct"
      />
    </div>

    <p v-if="!loading && !error && products.length === 0" class="product-page__empty">
      No hay productos disponibles.
    </p>
  </main>
</template>

<script src="./ProductPage.js"></script>
<style src="./ProductPage.css" scoped></style>
