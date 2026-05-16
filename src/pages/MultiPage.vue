<script setup>
import DownloadForm from '../components/DownloadForm.vue'
</script>

<template>
  <div class="space-y-8">
    <section class="glass-card rounded-[2rem] p-5 sm:p-6 lg:p-8">
      <p class="text-xs uppercase tracking-[0.35em] text-red-300/70">Multi downloader</p>
      <h1 class="mt-2 text-3xl font-semibold text-white">Batch multiple videos in a single submission</h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
        Enter one URL per line and the frontend will send a single payload to <span class="text-slate-200">/download/videos</span>.
      </p>
    </section>

    <DownloadForm
      mode="multi"
      title="Multi-link downloader"
      description="Paste a list of video URLs and choose the output resolution before submitting the batch request."
    />
  </div>
</template>