<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ClipboardCopy, Download, X, FileAudio2, CheckCircle2 } from 'lucide-vue-next'
import { useDownloadStore } from '../stores/downloads'
import { useToastStore } from '../stores/toasts'
import { convertMp3File, getApiErrorMessage, buildDownloadUrl } from '../services/api'

const downloadStore = useDownloadStore()
const toastStore = useToastStore()
const { latestResult } = storeToRefs(downloadStore)
const converting = ref(false)

const isOpen = computed(() => Boolean(latestResult.value))

const summary = computed(() => {
  const result = latestResult.value
  if (!result) return ''
  if (result.filenames?.length) return `${result.filenames.length} files ready`
  if (result.mp3Filename) return result.mp3Filename
  return result.filename || result.message || ''
})

function revokeCurrentDownloadUrl() {
  if (latestResult.value?.downloadUrl) {
    window.URL.revokeObjectURL(latestResult.value.downloadUrl)
  }
}

function startBrowserDownload() {
  if (!latestResult.value?.downloadUrl) return

  const anchor = document.createElement('a')
  anchor.href = latestResult.value.downloadUrl
  anchor.download = latestResult.value.filename || 'download'
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

async function copyToClipboard(value) {
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
    toastStore.pushToast({ title: 'Copied', message: 'Result copied to clipboard.', tone: 'success' })
  } catch {
    toastStore.pushToast({ title: 'Copy failed', message: 'Browser clipboard access was denied.', tone: 'danger' })
  }
}

function closeModal() {
  revokeCurrentDownloadUrl()
  downloadStore.clearLatestResult()
}

async function convertCurrentResult() {
  if (!latestResult.value?.filename) {
    return
  }

  converting.value = true
  try {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (isMobile) {
      const direct = buildDownloadUrl('/convert/file', { filename: latestResult.value.filename })
      window.open(direct, '_blank')
      downloadStore.updateLatestResult({
        mp3Filename: null,
        message: 'Opened direct download in new tab. Your browser will save the file with the server-provided filename.',
        downloadUrl: direct,
      })
      toastStore.pushToast({ title: 'Conversion started', message: 'Direct download opened for mobile.', tone: 'success' })
    } else {
      const response = await convertMp3File({ filename: latestResult.value.filename })
      const header = response?.headers?.['x-download-filename'] || response?.headers?.['X-Download-Filename'] || response?.headers?.['content-disposition'] || response?.headers?.['Content-Disposition']
      const match = header?.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i)
      const filename = decodeURIComponent(match?.[1] || match?.[2] || 'download.mp3')
      revokeCurrentDownloadUrl()
      downloadStore.updateLatestResult({
        mp3Filename: filename,
        filename,
        downloadUrl: window.URL.createObjectURL(response.data),
        mimeType: response.headers?.['content-type'] || 'audio/mpeg',
        message: 'The selected download was converted to MP3.',
      })
      toastStore.pushToast({ title: 'Conversion complete', message: filename || 'MP3 file is ready.', tone: 'success' })
    }
  } catch (error) {
    toastStore.pushToast({ title: 'Conversion failed', message: getApiErrorMessage(error), tone: 'danger', duration: 5000 })
  } finally {
    converting.value = false
  }
}

watch(latestResult, (value) => {
  if (!value) {
    converting.value = false
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm" @click.self="closeModal">
        <Transition name="modal-panel">
          <div v-if="latestResult" class="glass-card w-full max-w-2xl rounded-[2rem] p-5 sm:p-6">
            <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p class="text-xs uppercase tracking-[0.35em] text-red-300/70">Result modal</p>
                <h3 class="mt-2 text-2xl font-semibold text-white">{{ latestResult.title }}</h3>
                <p class="mt-2 text-sm text-slate-400">{{ latestResult.message }}</p>
              </div>
              <button type="button" class="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-red-400/25 hover:bg-red-500/10 hover:text-white" @click="closeModal">
                <X class="h-5 w-5" />
              </button>
            </div>

            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Summary</p>
                <p class="mt-2 text-sm text-slate-200">{{ summary }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Resolution</p>
                <p class="mt-2 text-sm text-slate-200">{{ latestResult.resolution || 'n/a' }}p</p>
              </div>
            </div>

            <div v-if="latestResult.filename" class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Filename</p>
              <div class="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p class="break-all text-sm text-slate-100">{{ latestResult.filename }}</p>
                <button type="button" class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-slate-200 transition hover:border-red-400/25 hover:bg-red-500/10 hover:text-white" @click="copyToClipboard(latestResult.filename)">
                  <ClipboardCopy class="h-4 w-4" />
                  Copy
                </button>
              </div>
            </div>

            <div v-if="latestResult.filenames?.length" class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Files</p>
              <ul class="mt-3 space-y-2 text-sm text-slate-200">
                <li v-for="file in latestResult.filenames" :key="file" class="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  <CheckCircle2 class="h-4 w-4 text-emerald-400" />
                  <span class="break-all">{{ file }}</span>
                </li>
              </ul>
            </div>

            <div v-if="latestResult.mp3Filename" class="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-emerald-200/80">MP3 output</p>
              <p class="mt-2 text-sm text-emerald-50">{{ latestResult.mp3Filename }}</p>
            </div>

            <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                v-if="latestResult.downloadUrl"
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-50 transition hover:bg-emerald-500/20"
                @click="startBrowserDownload"
              >
                <Download class="h-4 w-4" />
                Download file
              </button>
              <button
                v-if="latestResult.filename && !latestResult.mp3Filename"
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-200 transition hover:border-red-400/25 hover:bg-red-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="converting"
                @click="convertCurrentResult"
              >
                <FileAudio2 class="h-4 w-4 text-red-400" />
                {{ converting ? 'Converting...' : 'Convert to MP3' }}
              </button>
              <button type="button" class="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400" @click="closeModal">
                <Download class="h-4 w-4" />
                Done
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>