<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import ToastStack from './components/ToastStack.vue'
import ResultModal from './components/ResultModal.vue'
</script>

<template>
  <div class="min-h-screen text-slate-100">
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute left-[-10%] top-[-15%] h-80 w-80 rounded-full bg-red-600/15 blur-3xl"></div>
      <div class="absolute right-[-5%] top-[10%] h-96 w-96 rounded-full bg-rose-500/10 blur-3xl"></div>
      <div class="absolute bottom-[-12%] left-[25%] h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
    </div>

    <AppNavbar />

    <main class="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <RouterView v-slot="{ Component, route }">
        <Transition
          name="page"
          mode="out-in"
          appear
        >
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
    <ToastStack />
    <ResultModal />
  </div>
</template>
