<script setup>
import DownloadForm from '../components/DownloadForm.vue'
</script>

<template>
  <div class="space-y-8">
    <section class="glass-card rounded-[2rem] p-5 sm:p-6 lg:p-8">
      <p class="text-xs uppercase tracking-[0.35em] text-red-300/70">Playlist downloader</p>
      <h1 class="mt-2 text-3xl font-semibold text-white">Process full playlists with one request</h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
        Use the dedicated playlist route for batch-style YouTube collections and keep the experience clean on mobile.
      </p>
    </section>

    <DownloadForm
      mode="playlist"
      title="Playlist download"
      description="Send a playlist URL to the API and keep the workflow focused on the single job at hand."
    />
  </div>
</template>