<script setup>
import { computed } from 'vue'
import { Clock3, FileAudio2, Files, Download, CircleSlash2, Trash2 } from 'lucide-vue-next'
import { useDownloadStore } from '../stores/downloads'

const downloadStore = useDownloadStore()
const history = computed(() => downloadStore.recentHistory)

function iconFor(record) {
  if (record.kind === 'multi') return Files
  if (record.format === 'mp3') return FileAudio2
  return Download
}
</script>

<template>
  <section class="glass-card rounded-[2rem] p-5 sm:p-6 lg:p-8">
    <div class="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Activity</p>
        <h3 class="mt-2 text-2xl font-semibold text-white">Download history</h3>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-white"
        @click="downloadStore.clearHistory()"
      >
        <Trash2 class="h-4 w-4" />
        Clear history
      </button>
    </div>

    <div v-if="history.length" class="mt-5 space-y-3">
      <article
        v-for="record in history"
        :key="record.id"
        class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-start gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-400">
            <component :is="iconFor(record)" class="h-5 w-5" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h4 class="font-medium text-white">{{ record.summary }}</h4>
              <span class="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.22em]" :class="record.status === 'success' ? 'bg-emerald-500/10 text-emerald-200' : 'bg-red-500/10 text-red-200'">{{ record.status }}</span>
            </div>
            <p class="mt-1 text-sm text-slate-400">{{ record.url }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500">
          <Clock3 class="h-4 w-4 text-red-400" />
          {{ new Date(record.createdAt).toLocaleString() }}
        </div>
      </article>
    </div>

    <div v-else class="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/25 px-6 py-12 text-center text-slate-400">
      <CircleSlash2 class="mx-auto mb-3 h-8 w-8 text-red-400/70" />
      No activity yet. Run a download to populate your history.
    </div>
  </section>
</template>