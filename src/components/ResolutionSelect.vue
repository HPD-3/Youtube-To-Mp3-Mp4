<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue'])

const options = ['360', '480', '720', '1080']
</script>

<template>
  <label class="block">
    <span class="mb-2 block text-sm font-medium text-slate-200">Resolution</span>
    <select
      class="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-slate-100 outline-none transition focus:border-red-400/40 focus:ring-2 focus:ring-red-500/20"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="option in options" :key="option" :value="option">{{ option }}p</option>
    </select>
  </label>
</template>