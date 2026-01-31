<template>
  <Teleport to="body">
    <Transition name="backdrop-modal">
      <div
        v-if="show"
        class="backdrop-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Modal'"
        @click.self="emit('close')"
      >
        <div class="backdrop-modal__content">
          <header v-if="title" class="backdrop-modal__header">
            <h2 class="backdrop-modal__title">{{ title }}</h2>
            <button
              type="button"
              class="backdrop-modal__close"
              aria-label="Cerrar"
              @click="emit('close')"
            >
              ×
            </button>
          </header>
          <div class="backdrop-modal__body">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script src="./BackdropModal.js"></script>
<style src="./BackdropModal.css" scoped></style>
