<script setup>
import HeroSection from '../components/HeroSection.vue'
import FeatureCards from '../components/FeatureCards.vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, Layers3, Download, FileAudio2 } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-8">
    <HeroSection />
    <FeatureCards />

    <section class="grid gap-4 lg:grid-cols-3">
      <div class="glass-card rounded-[1.75rem] p-6 lg:col-span-2">
        <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Workflow</p>
        <h2 class="mt-2 text-2xl font-semibold text-white">One frontend, multiple download paths</h2>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          The app routes each action to the FastAPI backend with matching payloads for video, playlist, multi-link, and audio conversion requests.
        </p>

        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <Download class="h-5 w-5 text-red-400" />
            <p class="mt-3 font-medium text-white">MP4</p>
            <p class="mt-1 text-sm text-slate-400">Resolution-aware video downloads.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <FileAudio2 class="h-5 w-5 text-red-400" />
            <p class="mt-3 font-medium text-white">MP3</p>
            <p class="mt-1 text-sm text-slate-400">Convert directly during the request.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <Layers3 class="h-5 w-5 text-red-400" />
            <p class="mt-3 font-medium text-white">Batch</p>
            <p class="mt-1 text-sm text-slate-400">Playlist and multi-link support.</p>
          </div>
        </div>
      </div>

      <div class="glass-card rounded-[1.75rem] p-6">
        <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Quick start</p>
        <h2 class="mt-2 text-xl font-semibold text-white">Jump into the dashboard</h2>
        <div class="mt-5 space-y-3">
          <RouterLink to="/downloader" class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:border-red-400/25 hover:bg-red-500/10">
            <span>Open downloader</span>
            <ArrowRight class="h-4 w-4 text-red-400" />
          </RouterLink>
          <RouterLink to="/playlist" class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:border-red-400/25 hover:bg-red-500/10">
            <span>Open playlist</span>
            <ArrowRight class="h-4 w-4 text-red-400" />
          </RouterLink>
          <RouterLink to="/multi" class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:border-red-400/25 hover:bg-red-500/10">
            <span>Open multi downloader</span>
            <ArrowRight class="h-4 w-4 text-red-400" />
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>