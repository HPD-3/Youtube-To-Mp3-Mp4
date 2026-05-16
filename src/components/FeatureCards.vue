<script setup>
import { Download, Files, FileAudio2, MonitorSmartphone, Sparkles, WandSparkles } from 'lucide-vue-next'

const features = [
  {
    title: 'MP4 download',
    description: 'Choose a resolution and send the video request directly to the API.',
    icon: Download,
  },
  {
    title: 'MP3 conversion',
    description: 'Convert downloads to audio with a single action in the same workflow.',
    icon: FileAudio2,
  },
  {
    title: 'Playlist support',
    description: 'Handle playlist links in a dedicated route with a focused UI.',
    icon: Files,
  },
  {
    title: 'Multi-link batch jobs',
    description: 'Paste multiple URLs, submit one request, and keep the UI organized.',
    icon: WandSparkles,
  },
  {
    title: 'Dark responsive shell',
    description: 'Glass cards, black surfaces, and red accents built for mobile first.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Production motion',
    description: 'Smooth transitions, loading states, toasts, and modal feedback.',
    icon: Sparkles,
  },
]
</script>

<template>
  <section class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <article
      v-for="feature in features"
      :key="feature.title"
      class="glass-card group rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-red-400/25 hover:bg-white/8"
    >
      <component :is="feature.icon" class="h-6 w-6 text-red-400 transition group-hover:scale-110" />
      <h3 class="mt-4 text-lg font-semibold text-white">{{ feature.title }}</h3>
      <p class="mt-2 text-sm leading-6 text-slate-400">{{ feature.description }}</p>
    </article>
  </section>
</template>