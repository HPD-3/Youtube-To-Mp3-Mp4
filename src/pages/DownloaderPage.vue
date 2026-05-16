<script setup>
import DownloadForm from '../components/DownloadForm.vue'
import DownloadHistory from '../components/DownloadHistory.vue'
</script>

<template>
  <div class="space-y-8">
    <DownloadForm
      mode="video"
      title="Download a video or convert it to MP3"
      description="Paste a single YouTube link, choose the resolution, and pick the output format. The form talks directly to the FastAPI backend."
    />
    <DownloadHistory />
  </div>
</template>