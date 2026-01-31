<template>
  <header class="page-header">
    <button type="button" class="page-header__back" aria-label="Volver" @click="emit('back')">
      ← {{ backLabel }}
    </button>
    <h1 v-if="title" class="page-header__title">{{ title }}</h1>
  </header>
</template>

<script src="./PageHeader.js"></script>
<style src="./PageHeader.css" scoped></style>
