<template>
  <section class="delivery-form">
    <h2 class="delivery-form__title">Datos de entrega</h2>
    <div class="delivery-form__field">
      <label for="country">País</label>
      <input
        id="country"
        v-model="delivery.country"
        type="text"
        autocomplete="country"
        placeholder="País"
        class="delivery-form__input"
        :class="{ 'delivery-form__input--error': errors.country }"
      />
      <span v-if="errors.country" class="delivery-form__error">{{ errors.country }}</span>
    </div>
    <div class="delivery-form__field">
      <label for="city">Ciudad</label>
      <input
        id="city"
        v-model="delivery.city"
        type="text"
        autocomplete="address-level2"
        placeholder="Ciudad"
        class="delivery-form__input"
        :class="{ 'delivery-form__input--error': errors.city }"
      />
      <span v-if="errors.city" class="delivery-form__error">{{ errors.city }}</span>
    </div>
    <div class="delivery-form__field">
      <label for="address">Dirección</label>
      <input
        id="address"
        v-model="delivery.address"
        type="text"
        autocomplete="address-line1"
        placeholder="Calle, número, barrio"
        class="delivery-form__input"
        :class="{ 'delivery-form__input--error': errors.address }"
      />
      <span v-if="errors.address" class="delivery-form__error">{{ errors.address }}</span>
    </div>
    <div class="delivery-form__field">
      <label for="fullName">Nombre completo</label>
      <input
        id="fullName"
        v-model="delivery.fullName"
        type="text"
        autocomplete="off"
        placeholder="Nombre y apellidos"
        class="delivery-form__input"
        :class="{ 'delivery-form__input--error': errors.fullName }"
      />
      <span v-if="errors.fullName" class="delivery-form__error">{{ errors.fullName }}</span>
    </div>
    <div class="delivery-form__field">
      <label for="document">Documento</label>
      <input
        id="document"
        v-model="delivery.document"
        type="text"
        autocomplete="off"
        placeholder="Número de documento"
        class="delivery-form__input"
        :class="{ 'delivery-form__input--error': errors.document }"
      />
      <span v-if="errors.document" class="delivery-form__error">{{ errors.document }}</span>
    </div>
    <div class="delivery-form__field">
      <label for="email">Correo</label>
      <input
        id="email"
        v-model="delivery.email"
        type="email"
        autocomplete="off"
        placeholder="Correo electrónico"
        class="delivery-form__input"
        :class="{ 'delivery-form__input--error': errors.email }"
      />
      <span v-if="errors.email" class="delivery-form__error">{{ errors.email }}</span>
    </div>
  </section>
</template>

<script src="./DeliveryForm.js"></script>
<style src="./DeliveryForm.css" scoped></style>
