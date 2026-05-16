<script setup>
import { RouterLink } from 'vue-router'
import { ArrowRight, Play, ShieldCheck, Zap } from 'lucide-vue-next'
import BackendStatusBadge from './BackendStatusBadge.vue'
</script>

<template>
  <section class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-6 py-10 shadow-2xl shadow-black/30 sm:px-10 lg:px-14 lg:py-16">
    <div class="absolute inset-0 grid-background opacity-30"></div>
    <div class="absolute right-[-5rem] top-[-5rem] h-64 w-64 rounded-full bg-red-500/15 blur-3xl"></div>
    <div class="relative grid gap-10 lg:grid-cols-[1.25fr_0.9fr] lg:items-center">
      <div>
        <div class="mb-5 flex flex-wrap items-center gap-3">
          <span class="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-300">Dark SaaS UI</span>
          <BackendStatusBadge />
        </div>

        <h1 class="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
          Download and convert YouTube content with a frontend built like a premium product.
        </h1>

        <p class="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          WebConvert gives you a streamlined experience for MP4 downloads, MP3 conversion, playlist handling, and multi-link batch downloads. Everything connects directly to your FastAPI backend.
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <RouterLink
            to="/downloader"
            class="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-400"
          >
            Open Downloader
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
          <RouterLink
            to="/about"
            class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-red-400/25 hover:bg-red-500/10 hover:text-white"
          >
            <Play class="h-4 w-4 text-red-400" />
            Learn more
          </RouterLink>
        </div>

        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          <div class="glass-panel rounded-2xl px-4 py-4">
            <ShieldCheck class="mb-3 h-5 w-5 text-red-400" />
            <p class="text-sm font-medium text-white">Direct API connection</p>
            <p class="mt-1 text-sm text-slate-400">Axios hooks into localhost:8000.</p>
          </div>
          <div class="glass-panel rounded-2xl px-4 py-4">
            <Zap class="mb-3 h-5 w-5 text-red-400" />
            <p class="text-sm font-medium text-white">Fast workflows</p>
            <p class="mt-1 text-sm text-slate-400">Smooth loading states and toasts.</p>
          </div>
          <div class="glass-panel rounded-2xl px-4 py-4">
            <Play class="mb-3 h-5 w-5 text-red-400" />
            <p class="text-sm font-medium text-white">Multi-page app</p>
            <p class="mt-1 text-sm text-slate-400">Home, downloader, playlist, multi, about.</p>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="glass-card rounded-[1.75rem] p-5 sm:p-6">
          <div class="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Live control</p>
              <p class="mt-2 text-lg font-semibold text-white">Download command center</p>
            </div>
            <div class="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs text-red-200">Ready</div>
          </div>

          <div class="mt-5 space-y-4">
            <div class="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Input</p>
              <div class="mt-3 h-12 rounded-xl border border-white/10 bg-white/5"></div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Resolution</p>
                <div class="mt-3 h-11 rounded-xl border border-white/10 bg-white/5"></div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Mode</p>
                <div class="mt-3 flex gap-2">
                  <div class="h-11 flex-1 rounded-xl border border-red-400/25 bg-red-500/15"></div>
                  <div class="h-11 flex-1 rounded-xl border border-white/10 bg-white/5"></div>
                </div>
              </div>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div class="h-11 rounded-xl bg-red-500"></div>
            </div>
          </div>

          <div class="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            The UI is tuned for one-handed mobile use and fast desktop workflows.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>