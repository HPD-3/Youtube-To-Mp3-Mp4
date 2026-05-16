<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X, RadioTower, Youtube, Download, Layers3, Info } from 'lucide-vue-next'
import { getHealth } from '../services/api'

const route = useRoute()
const menuOpen = ref(false)
const apiStatus = ref('checking')

const links = [
  { name: 'Home', to: '/', icon: Youtube },
  { name: 'Downloader', to: '/downloader', icon: Download },
  { name: 'Playlist', to: '/playlist', icon: Layers3 },
  { name: 'Multi', to: '/multi', icon: RadioTower },
  { name: 'About', to: '/about', icon: Info },
]

const currentLabel = computed(() => route.meta.title || 'Home')

async function checkHealth() {
  try {
    const health = await getHealth()
    apiStatus.value = health?.status === 'ok' ? 'online' : 'degraded'
  } catch {
    apiStatus.value = 'offline'
  }
}

onMounted(checkHealth)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/10 bg-black/65 backdrop-blur-xl">
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-3">
        <div class="pulse-red flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/15 text-red-400 shadow-[0_0_35px_rgba(239,68,68,0.2)]">
          <Youtube class="h-5 w-5" />
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-red-300/70">WebConvert</p>
          <p class="text-sm text-slate-300">YouTube Downloader & Converter</p>
        </div>
      </RouterLink>

      <nav class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 lg:flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          :class="route.path === link.to ? 'bg-red-500/15 text-white ring-1 ring-red-400/25' : ''"
        >
          <component :is="link.icon" class="h-4 w-4 text-red-400 transition group-hover:scale-110" />
          {{ link.name }}
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-3 lg:flex">
        <div class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
          <span class="mr-2 inline-block h-2 w-2 rounded-full" :class="apiStatus === 'online' ? 'bg-emerald-400' : apiStatus === 'degraded' ? 'bg-amber-400' : 'bg-red-400'"></span>
          API {{ apiStatus }}
        </div>
        <div class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
          {{ currentLabel }}
        </div>
      </div>

      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-red-400/30 hover:bg-red-500/10 lg:hidden"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" class="h-5 w-5" />
        <Menu v-else class="h-5 w-5" />
      </button>
    </div>

    <Transition name="page">
      <div v-if="menuOpen" class="border-t border-white/10 bg-black/90 px-4 py-4 lg:hidden sm:px-6">
        <div class="mx-auto flex max-w-7xl flex-col gap-2">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-red-400/25 hover:bg-red-500/10 hover:text-white"
            :class="route.path === link.to ? 'border-red-400/30 bg-red-500/15 text-white' : ''"
            @click="menuOpen = false"
          >
            <component :is="link.icon" class="h-4 w-4 text-red-400" />
            {{ link.name }}
          </RouterLink>
        </div>
      </div>
    </Transition>
  </header>
</template>