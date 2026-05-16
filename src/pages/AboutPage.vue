<script setup>
import { CheckCircle2, Server, ShieldCheck, FileMusic, Film, ListVideo } from 'lucide-vue-next'

const endpoints = [
  { method: 'GET', path: '/health', description: 'Backend health check used by the UI.' },
  { method: 'POST', path: '/download/video', description: 'Download a single video at a chosen resolution.' },
  { method: 'POST', path: '/download/videos', description: 'Download multiple videos from a list of URLs.' },
  { method: 'POST', path: '/download/playlist', description: 'Download a full playlist through the API.' },
  { method: 'POST', path: '/convert/mp3', description: 'Convert an existing filename into MP3.' },
  { method: 'POST', path: '/download/convert', description: 'Download a video and convert it to MP3 in one request.' },
]

const highlights = [
  { title: 'Vue 3 + Vite', description: 'Fast component-driven frontend architecture.', icon: CheckCircle2 },
  { title: 'Axios service layer', description: 'Centralized requests and error normalization.', icon: Server },
  { title: 'Dark glass UI', description: 'Black surfaces, red accents, and subtle depth.', icon: ShieldCheck },
  { title: 'MP3 workflow', description: 'Supports both download-and-convert and post-download conversion.', icon: FileMusic },
  { title: 'Video resolution control', description: '360p, 480p, 720p, and 1080p selectors.', icon: Film },
  { title: 'Batch support', description: 'Playlist and multi-link flows stay separate but consistent.', icon: ListVideo },
]
</script>

<template>
  <div class="space-y-8">
    <section class="glass-card rounded-[2rem] p-5 sm:p-6 lg:p-8">
      <p class="text-xs uppercase tracking-[0.35em] text-red-300/70">About</p>
      <h1 class="mt-2 text-3xl font-semibold text-white">A production-style frontend for the FastAPI downloader backend</h1>
      <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
        This interface is designed to feel like a modern SaaS control panel while keeping the implementation simple, direct, and close to the API contract.
      </p>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in highlights" :key="item.title" class="glass-card rounded-3xl p-6">
        <component :is="item.icon" class="h-6 w-6 text-red-400" />
        <h2 class="mt-4 text-lg font-semibold text-white">{{ item.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-400">{{ item.description }}</p>
      </article>
    </section>

    <section class="glass-card rounded-[2rem] p-5 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-slate-500">API contract</p>
          <h2 class="mt-2 text-2xl font-semibold text-white">Endpoints used by the frontend</h2>
        </div>
      </div>

      <div class="mt-5 grid gap-3">
        <div v-for="endpoint in endpoints" :key="endpoint.path" class="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-white">{{ endpoint.method }} {{ endpoint.path }}</p>
            <p class="mt-1 text-sm text-slate-400">{{ endpoint.description }}</p>
          </div>
          <span class="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-500">Connected</span>
        </div>
      </div>
    </section>
  </div>
</template>