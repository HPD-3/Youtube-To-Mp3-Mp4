<script setup>
import { Github, Sparkles } from 'lucide-vue-next'
</script>

<template>
  <footer class="border-t border-white/10 bg-black/70">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <div class="mb-2 flex items-center gap-2 text-slate-200">
          <Sparkles class="h-4 w-4 text-red-400" />
          <span class="font-medium">WebConvert</span>
        </div>
        <p>Modern YouTube download and conversion frontend connected to the FastAPI backend.</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-500">Vue 3</span>
        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-500">TailwindCSS</span>
        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-500">FastAPI</span>
        <a
          href="https://github.com/HPD-3/Youtube-To-Mp3-Mp4"
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-white"
        >
          <Github class="h-4 w-4" />
          Source
        </a>
      </div>
    </div>
  </footer>
</template>