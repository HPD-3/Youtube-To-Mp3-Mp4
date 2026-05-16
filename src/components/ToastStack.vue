<script setup>
import { storeToRefs } from 'pinia'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToastStore } from '../stores/toasts'

const toastStore = useToastStore()
const { items } = storeToRefs(toastStore)

function iconFor(tone) {
  if (tone === 'success') return CheckCircle2
  if (tone === 'danger') return AlertTriangle
  return Info
}
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      <TransitionGroup name="toast" tag="div" class="space-y-3">
        <div
          v-for="item in items"
          :key="item.id"
          class="pointer-events-auto glass-card flex items-start gap-3 rounded-2xl p-4"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl" :class="item.tone === 'success' ? 'bg-emerald-500/15 text-emerald-300' : item.tone === 'danger' ? 'bg-red-500/15 text-red-300' : 'bg-white/10 text-slate-100'">
            <component :is="iconFor(item.tone)" class="h-5 w-5" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between gap-3">
              <h4 class="font-semibold text-white">{{ item.title }}</h4>
              <button type="button" class="rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-white" @click="toastStore.dismissToast(item.id)">
                <X class="h-4 w-4" />
              </button>
            </div>
            <p class="mt-1 text-sm leading-6 text-slate-400">{{ item.message }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>