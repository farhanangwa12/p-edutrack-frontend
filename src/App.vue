<template>


    <div class="wrapper">
        <nav>
            <Sidebar username="Test" />
        </nav>

        <main>
            <RouterView />
        </main>
    </div>


</template>


<script lang="ts" setup>
import Sidebar from './components/Sidebar.vue';
</script>


<style scoped>
.wrapper {
    display: flex;
    height: 100vh;
    /* width: 100%; */
    background-color: blue;
}
nav {
    width: 20%;
}
main {
    width: 80%;
}
</style>