import { defineStore } from 'pinia'

const STORAGE_KEY = 'webconvert-download-history'

function loadHistory() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function persistHistory(history) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

function createId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useDownloadStore = defineStore('downloads', {
  state: () => ({
    history: loadHistory(),
    latestResult: null,
  }),
  getters: {
    recentHistory: (state) => state.history.slice(0, 8),
  },
  actions: {
    addHistory(entry) {
      const record = {
        id: createId(),
        createdAt: new Date().toISOString(),
        ...entry,
      }

      this.history = [record, ...this.history].slice(0, 20)
      persistHistory(this.history)
      return record
    },
    clearHistory() {
      this.history = []
      persistHistory(this.history)
    },
    setLatestResult(result) {
      this.latestResult = result
    },
    clearLatestResult() {
      this.latestResult = null
    },
    updateLatestResult(patch) {
      if (!this.latestResult) {
        return
      }

      this.latestResult = {
        ...this.latestResult,
        ...patch,
      }
    },
  },
})