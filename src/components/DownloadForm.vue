<script setup>
import { computed, ref } from 'vue'
import { Download, FileAudio2, Link2, ListPlus } from 'lucide-vue-next'
import ResolutionSelect from './ResolutionSelect.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { useDownloadStore } from '../stores/downloads'
import { useToastStore } from '../stores/toasts'
import {
  convertMp3,
  convertMp3File,
  downloadAndConvert,
  downloadAndConvertFile,
  downloadPlaylist,
  downloadVideo,
  downloadVideoFile,
  downloadVideos,
  getApiErrorMessage,
  buildDownloadUrl,
} from '../services/api'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['video', 'playlist', 'multi'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

const downloadStore = useDownloadStore()
const toastStore = useToastStore()

const singleUrl = ref('')
const multiUrls = ref('')
const resolution = ref('720')
const format = ref('mp4')
const loading = ref(false)
const progress = ref(0)

function createDownloadUrl(blob) {
  return window.URL.createObjectURL(blob)
}

function extractFilenameFromResponse(response, fallback) {
  const header = response?.headers?.['content-disposition'] || response?.headers?.['Content-Disposition']
  const match = header?.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i)
  return decodeURIComponent(match?.[1] || match?.[2] || fallback)
}

const primaryIcon = computed(() => {
  if (props.mode === 'playlist') return ListPlus
  if (props.mode === 'multi') return Link2
  return format.value === 'mp3' ? FileAudio2 : Download
})

const inputLabel = computed(() => {
  if (props.mode === 'playlist') return 'Playlist URL'
  if (props.mode === 'multi') return 'Video URLs'
  return 'YouTube URL'
})

const helperText = computed(() => {
  if (props.mode === 'playlist') return 'Paste a playlist link and choose the target resolution.'
  if (props.mode === 'multi') return 'Enter one URL per line for batch downloads.'
  return 'Switch between MP4 download and MP3 conversion.'
})

function startProgress() {
  progress.value = 10
  const timer = window.setInterval(() => {
    if (progress.value < 88) {
      progress.value += 8
      return
    }
    window.clearInterval(timer)
  }, 180)

  return timer
}

async function fetchYoutubeTitle(url) {
  try {
    const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const res = await fetch(oembed)
    if (!res.ok) return null
    const json = await res.json()
    return json.title || null
  } catch (e) {
    return null
  }
}

function sanitizeFilename(name) {
  return name.replace(/[\\/:*?"<>|]+/g, '_').trim()
}

async function submitForm() {
  if (loading.value) {
    return
  }

  const url = singleUrl.value.trim()
  const urls = multiUrls.value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  if (props.mode === 'video' && !url) {
    toastStore.pushToast({ title: 'Missing URL', message: 'Paste a YouTube video link to continue.', tone: 'danger' })
    return
  }

  if (props.mode === 'playlist' && !url) {
    toastStore.pushToast({ title: 'Missing playlist link', message: 'Add a playlist URL before submitting.', tone: 'danger' })
    return
  }

  if (props.mode === 'multi' && urls.length === 0) {
    toastStore.pushToast({ title: 'Missing URLs', message: 'Add at least one video URL for batch download.', tone: 'danger' })
    return
  }

  loading.value = true
  const timer = startProgress()

  try {
    let response
    let latestResult

    if (props.mode === 'video') {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      if (isMobile) {
        // On mobile, open the direct download URL so the browser uses server's Content-Disposition filename
        if (format.value === 'mp3') {
          const direct = buildDownloadUrl('/download/convert/file', { url, resolution: resolution.value })
          window.open(direct, '_blank')
          latestResult = {
            kind: 'video',
            mode: 'mp3',
            title: 'MP3 conversion started',
            message: 'Opened direct download in new tab. Your browser will save the file with the server-provided filename.',
            filename: null,
            downloadUrl: direct,
            mimeType: 'audio/mpeg',
          }
        } else {
          const direct = buildDownloadUrl('/download/video/file', { url, resolution: resolution.value })
          window.open(direct, '_blank')
          latestResult = {
            kind: 'video',
            mode: 'mp4',
            title: 'Video download started',
            message: 'Opened direct download in new tab. Your browser will save the file with the server-provided filename.',
            filename: null,
            downloadUrl: direct,
            mimeType: 'video/mp4',
          }
        }
      } else {
        if (format.value === 'mp3') {
          response = await downloadAndConvertFile({ url, resolution: resolution.value })
          const filename = extractFilenameFromResponse(response, 'download.mp3')
          latestResult = {
            kind: 'video',
            mode: 'mp3',
            title: 'MP3 conversion complete',
            message: 'The backend downloaded and converted the video into audio.',
            filename,
            downloadUrl: createDownloadUrl(response.data),
            mimeType: response.headers?.['content-type'] || 'audio/mpeg',
          }
        } else {
          response = await downloadVideoFile({ url, resolution: resolution.value })
          const filename = extractFilenameFromResponse(response, 'download.mp4')
          latestResult = {
            kind: 'video',
            mode: 'mp4',
            title: 'Video download complete',
            message: 'The backend returned a ready-to-use file.',
            filename,
            downloadUrl: createDownloadUrl(response.data),
            mimeType: response.headers?.['content-type'] || 'video/mp4',
          }
        }
      }
    } else if (props.mode === 'playlist') {
      response = await downloadPlaylist({ url, resolution: resolution.value })
      latestResult = {
        kind: 'playlist',
        mode: 'playlist',
        title: 'Playlist job finished',
        message: response?.message || 'The playlist request finished successfully.',
        url,
        resolution: resolution.value,
      }
    } else {
      response = await downloadVideos({ urls, resolution: resolution.value })
      latestResult = {
        kind: 'multi',
        mode: 'multi',
        title: 'Batch download complete',
        message: 'All requested URLs were sent to the backend.',
        filenames: response?.filenames || [],
        urls,
        resolution: resolution.value,
      }
    }

    progress.value = 100
    downloadStore.setLatestResult(latestResult)
    downloadStore.addHistory({
      kind: props.mode,
      status: 'success',
      format: props.mode === 'video' ? format.value : 'mp4',
      url: props.mode === 'multi' ? urls.join('\n') : url,
      resolution: resolution.value,
      summary: latestResult.title,
    })
    toastStore.pushToast({
      title: 'Request successful',
      message: latestResult.title,
      tone: 'success',
    })
    // Auto-download the returned file when backend supplies a blob URL
    if (latestResult.downloadUrl) {
      try {
        // Prefer the YouTube title (via oEmbed) if available, otherwise fall back to server filename
        let downloadName = latestResult.filename || (latestResult.mode === 'mp3' ? 'download.mp3' : 'download.mp4')
        if (props.mode === 'video' && singleUrl && singleUrl.trim()) {
          const title = await fetchYoutubeTitle(singleUrl.trim())
          if (title) {
            const ext = (latestResult.mode === 'mp3' || format.value === 'mp3') ? '.mp3' : '.mp4'
            downloadName = `${sanitizeFilename(title)}${ext}`
          }
        }

        const anchor = document.createElement('a')
        anchor.href = latestResult.downloadUrl
        anchor.download = downloadName
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        // Revoke the object URL after a short delay to allow the download to start
        window.setTimeout(() => {
          try {
            window.URL.revokeObjectURL(latestResult.downloadUrl)
          } catch (e) {
            // ignore
          }
        }, 10000)
      } catch (e) {
        // If auto-download fails, do nothing — user can still click Download in the modal.
      }
    }
  } catch (error) {
    const message = getApiErrorMessage(error)
    toastStore.pushToast({
      title: 'Request failed',
      message,
      tone: 'danger',
      duration: 5000,
    })
    downloadStore.addHistory({
      kind: props.mode,
      status: 'error',
      format: props.mode === 'video' ? format.value : 'mp4',
      url: props.mode === 'multi' ? urls.join('\n') : url,
      resolution: resolution.value,
      summary: message,
    })
  } finally {
    window.clearInterval(timer)
    loading.value = false
    window.setTimeout(() => {
      progress.value = 0
    }, 500)
  }
}

async function convertLatestFile() {
  if (!downloadStore.latestResult?.filename) {
    return
  }

  try {
    const response = await convertMp3File({ filename: downloadStore.latestResult.filename })
    const filename = extractFilenameFromResponse(response, 'download.mp3')
    if (downloadStore.latestResult.downloadUrl) {
      window.URL.revokeObjectURL(downloadStore.latestResult.downloadUrl)
    }
    downloadStore.updateLatestResult({
      mp3Filename: filename,
      filename,
      downloadUrl: createDownloadUrl(response.data),
      mimeType: response.headers?.['content-type'] || 'audio/mpeg',
      title: 'MP3 conversion complete',
      message: 'The downloaded file was converted to MP3.',
    })
    toastStore.pushToast({
      title: 'MP3 ready',
      message: filename || 'The file was converted successfully.',
      tone: 'success',
    })
  } catch (error) {
    toastStore.pushToast({
      title: 'Conversion failed',
      message: getApiErrorMessage(error),
      tone: 'danger',
      duration: 5000,
    })
  }
}
</script>

<template>
  <section class="glass-card rounded-[2rem] p-5 sm:p-6 lg:p-8">
    <div class="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.35em] text-red-300/70">{{ props.mode }} workflow</p>
        <h2 class="mt-2 text-2xl font-semibold text-white sm:text-3xl">{{ title }}</h2>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{{ description }}</p>
      </div>
      <div class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
        API ready
      </div>
    </div>

    <div class="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <form class="space-y-5" @submit.prevent="submitForm">
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-200">{{ inputLabel }}</span>
          <textarea
            v-if="props.mode === 'multi'"
            v-model="multiUrls"
            rows="7"
            class="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-red-400/40 focus:ring-2 focus:ring-red-500/20"
            placeholder="https://youtube.com/watch?v=...\nhttps://youtube.com/watch?v=..."
          ></textarea>
          <input
            v-else
            v-model="singleUrl"
            type="url"
            class="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-red-400/40 focus:ring-2 focus:ring-red-500/20"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </label>

        <div class="grid gap-4 sm:grid-cols-2">
          <ResolutionSelect v-model="resolution" />

          <div v-if="props.mode === 'video'" class="block">
            <span class="mb-2 block text-sm font-medium text-slate-200">Format</span>
            <div class="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/40 p-2">
              <button
                type="button"
                class="rounded-xl px-4 py-3 text-sm font-semibold transition"
                :class="format === 'mp4' ? 'bg-red-500/15 text-white ring-1 ring-red-400/25' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'"
                @click="format = 'mp4'"
              >
                MP4
              </button>
              <button
                type="button"
                class="rounded-xl px-4 py-3 text-sm font-semibold transition"
                :class="format === 'mp3' ? 'bg-red-500/15 text-white ring-1 ring-red-400/25' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'"
                @click="format = 'mp3'"
              >
                MP3
              </button>
            </div>
          </div>
        </div>

        <p class="text-sm text-slate-400">{{ helperText }}</p>

        <button
          type="submit"
          class="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-5 py-4 font-semibold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          <component :is="primaryIcon" class="h-5 w-5 transition group-hover:scale-110" />
          <span v-if="!loading">{{ props.mode === 'video' && format === 'mp3' ? 'Convert to MP3' : 'Start download' }}</span>
          <LoadingSpinner v-else />
        </button>

        <div v-if="loading || progress > 0" class="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div class="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
            <span>Progress</span>
            <span>{{ progress }}%</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-white/10">
            <div class="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-300" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>
      </form>

      <aside class="space-y-4 rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Request details</p>
          <h3 class="mt-2 text-lg font-semibold text-white">What happens next</h3>
        </div>

        <div class="space-y-3 text-sm text-slate-400">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            1. Your payload is sent to the FastAPI endpoint through Axios.
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            2. The backend returns a filename, filenames, or completion message.
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            3. History and toast notifications update instantly in the UI.
          </div>
        </div>

        <button
          v-if="props.mode === 'video' && downloadStore.latestResult?.filename && downloadStore.latestResult?.mode === 'mp4'"
          type="button"
          class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-white"
          @click="convertLatestFile"
        >
          <FileAudio2 class="h-4 w-4 text-red-400" />
          Convert latest file to MP3
        </button>
      </aside>
    </div>
  </section>
</template>