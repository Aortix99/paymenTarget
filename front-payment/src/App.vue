<script setup>
import { onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

onMounted(() => {
  if (!store.state.product.id) store.dispatch('initProduct')
})

watch(
  () => store.state.step,
  (step) => {
    const path = router.currentRoute.value.path
    console.log('observando si cambia step', { step, path });
    const stepToPath = {
      product: '/',
      checkout: '/checkout',
      resumen: '/resumen',
      resultado: '/resultado',
    }
    const expectedPath = stepToPath[step]
    if (expectedPath && path !== expectedPath && store.getters.canRecoverProgress) {
      router.replace(expectedPath)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
@import './assets/global.css';
</style>
