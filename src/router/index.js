import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import DownloaderPage from '../pages/DownloaderPage.vue'
import PlaylistPage from '../pages/PlaylistPage.vue'
import MultiPage from '../pages/MultiPage.vue'
import AboutPage from '../pages/AboutPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage, meta: { title: 'Home' } },
  {
    path: '/downloader',
    name: 'downloader',
    component: DownloaderPage,
    meta: { title: 'Downloader' },
  },
  {
    path: '/playlist',
    name: 'playlist',
    component: PlaylistPage,
    meta: { title: 'Playlist Downloader' },
  },
  {
    path: '/multi',
    name: 'multi',
    component: MultiPage,
    meta: { title: 'Multi Downloader' },
  },
  { path: '/about', name: 'about', component: AboutPage, meta: { title: 'About' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const suffix = to.meta.title ? ` | ${to.meta.title}` : ''
  document.title = `WebConvert${suffix}`
})

export default router