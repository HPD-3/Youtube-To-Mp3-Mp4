import { defineStore } from 'pinia'

function createId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useToastStore = defineStore('toasts', {
  state: () => ({
    items: [],
  }),
  actions: {
    pushToast({ title, message, tone = 'neutral', duration = 3500 }) {
      const id = createId()
      this.items.unshift({ id, title, message, tone })

      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          this.dismissToast(id)
        }, duration)
      }

      return id
    },
    dismissToast(id) {
      this.items = this.items.filter((item) => item.id !== id)
    },
    clearToasts() {
      this.items = []
    },
  },
})