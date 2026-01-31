<template>
  <section class="card-form">
    <h2 class="card-form__title">Tarjeta de crédito</h2>
    <CardLogos />
    <div class="card-form__field">
      <label for="card-number">Número de tarjeta</label>
      <input
        id="card-number"
        v-model="card.number"
        type="text"
        inputmode="numeric"
        autocomplete="cc-number"
        placeholder="0000 0000 0000 0000"
        maxlength="19"
        class="card-form__input"
        :class="{ 'card-form__input--error': errors.number }"
        @input="onCardNumberInput"
      />
      <span v-if="errors.number" class="card-form__error">{{ errors.number }}</span>
    </div>
    <div class="card-form__field">
      <label for="card-holder">Nombre en la tarjeta</label>
      <input
        id="card-holder"
        v-model="card.holder"
        type="text"
        autocomplete="cc-name"
        placeholder="Como aparece en la tarjeta"
        class="card-form__input"
        :class="{ 'card-form__input--error': errors.holder }"
      />
      <span v-if="errors.holder" class="card-form__error">{{ errors.holder }}</span>
    </div>
    <div class="card-form__row">
      <div class="card-form__field">
        <label for="card-expiry">Vencimiento (MM/AA)</label>
        <input
          id="card-expiry"
          v-model="card.expiry"
          type="text"
          inputmode="numeric"
          autocomplete="cc-exp"
          placeholder="MM/AA"
          maxlength="5"
          class="card-form__input"
          :class="{ 'card-form__input--error': errors.expiry }"
          @input="onExpiryInput"
        />
        <span v-if="errors.expiry" class="card-form__error">{{ errors.expiry }}</span>
      </div>
      <div class="card-form__field">
        <label for="card-cvc">CVC</label>
        <input
          id="card-cvc"
          v-model="card.cvc"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          placeholder="123"
          maxlength="4"
          class="card-form__input"
          :class="{ 'card-form__input--error': errors.cvc }"
          @input="onCvcInput"
        />
        <span v-if="errors.cvc" class="card-form__error">{{ errors.cvc }}</span>
      </div>
    </div>
  </section>
</template>

<script src="./CardForm.js"></script>
<style src="./CardForm.css" scoped></style>
