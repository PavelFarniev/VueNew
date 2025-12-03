import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import PalettePage from '../views/PalettePage.vue'
import LibraryPage from '../views/LibraryPage.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/palette', name: 'Palette', component: PalettePage },
    { path: '/library', name: 'Library', component: LibraryPage },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router