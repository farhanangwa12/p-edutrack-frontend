import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import MataPelajaran from "./views/MataPelajaran.vue";
import Siswa from "./views/Siswa.vue";
import RekapNilai from "./views/RekapNilai.vue";

const routes = [
    {path: '/', component: Dashboard},
    {path: '/mata-pelajaran', component: MataPelajaran},
    {path: '/siswa', component: Siswa},
    {path: '/rekap-nilai', component: RekapNilai}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;