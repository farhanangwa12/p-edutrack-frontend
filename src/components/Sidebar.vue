<template>
    <aside class="sidebar">
        <div class="user">
            <p>👤 {{ username }}</p>
        </div>
        <nav>
            <ul>
                <li><RouterLink to="/">Dashboard</RouterLink></li>
                <li><RouterLink to="/siswa">Siswa </RouterLink></li>
                <li><RouterLink to="/mata-pelajaran">Mata Pelajaran</RouterLink></li>
                <li><RouterLink to="/rekap-nilai">Rekap Nilai</RouterLink></li>
            </ul>
        </nav>
    </aside>
</template>


<script lang="ts" setup>
import { RouterLink } from 'vue-router';

defineProps<{ username: string }>()
</script>


<style scoped>
.sidebar {
    background-color: #1e293b;
    height: 100%;
    color: white;
    padding: 20px;
    flex: 1;
}

.user {
    margin-bottom: 20px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin: 10px 0;
}

a {
    color: white;
    text-decoration: none;
}

a.router-link-exact-active {
    font-weight: bold;
}
</style>