<script setup>
import { onMounted, ref } from 'vue'
import { CheckCircle2, LoaderCircle, TriangleAlert } from 'lucide-vue-next'
import { getHealth } from '../services/api'

const status = ref('checking')

async function loadStatus() {
  try {
    const response = await getHealth()
    status.value = response?.status === 'ok' ? 'online' : 'degraded'
  } catch {
    status.value = 'offline'
  }
}

onMounted(loadStatus)
</script>

<template>
  <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
    <LoaderCircle v-if="status === 'checking'" class="h-4 w-4 animate-spin text-red-400" />
    <CheckCircle2 v-else-if="status === 'online'" class="h-4 w-4 text-emerald-400" />
    <TriangleAlert v-else class="h-4 w-4 text-amber-400" />
    <span>
      Backend
      <strong class="font-semibold text-white">{{ status }}</strong>
    </span>
  </div>
</template>