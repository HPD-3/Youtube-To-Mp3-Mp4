import axios from 'axios'

function normalizeBaseURL(value) {
  const fallback = 'http://localhost:8000'

  if (import.meta.env.DEV) {
    return '/api'
  }

  if (!value) {
    return fallback
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  if (/^(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/i.test(value)) {
    return `http://${value}`
  }

  return `https://${value}`
}

const api = axios.create({
  baseURL: normalizeBaseURL(import.meta.env.VITE_API_BASE_URL),
  timeout: 120000,
})

function normalizeError(error) {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.statusText ||
    error?.message ||
    'Request failed'
  )
}

export function getApiErrorMessage(error) {
  return normalizeError(error)
}

export async function getHealth() {
  const { data } = await api.get('/health')
  return data
}

export async function downloadVideo(payload) {
  const { data } = await api.post('/download/video', payload)
  return data
}

export async function downloadVideoFile(payload) {
  const response = await api.post('/download/video/file', payload, {
    responseType: 'blob',
  })

  return response
}

export async function downloadVideos(payload) {
  const { data } = await api.post('/download/videos', payload)
  return data
}

export async function downloadPlaylist(payload) {
  const { data } = await api.post('/download/playlist', payload)
  return data
}

export async function convertMp3(payload) {
  const { data } = await api.post('/convert/mp3', payload)
  return data
}

export async function convertMp3File(payload) {
  const response = await api.post('/convert/file', payload, {
    responseType: 'blob',
  })

  return response
}

export async function downloadAndConvert(payload) {
  const { data } = await api.post('/download/convert', payload)
  return data
}

export async function downloadAndConvertFile(payload) {
  const response = await api.post('/download/convert/file', payload, {
    responseType: 'blob',
  })

  return response
}

export function buildDownloadUrl(path, params = {}) {
  const base = api.defaults.baseURL || ''
  const qs = new URLSearchParams(params).toString()
  return `${base}${path}${qs ? '?' + qs : ''}`
}