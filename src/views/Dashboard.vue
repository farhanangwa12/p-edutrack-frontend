<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>

    <div class="stat-grid">
      <div class="stat-card">
        <h3>Jumlah Siswa</h3>
        <p>{{ jumlahSiswa }}</p>
      </div>
      <div class="stat-card">
        <h3>Mata Pelajaran</h3>
        <p>{{ mataPelajaran }}</p>
      </div>
      <div class="stat-card">
        <h3>Rata-rata Nilai</h3>
        <p>{{ rataRataNilai }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';


onMounted( async () =>  {
  try {
    const dataRataRata = await fetch('http://127.0.0.1:8000/api/dashboard');
    const result  = await dataRataRata.json();

    jumlahSiswa.value = result.jumlah_siswa;
    mataPelajaran.value = result.mata_pelajaran;
    rataRataNilai.value = Number(parseFloat(result.rata_nilai).toFixed(2));


  } catch (error) {
    console.log(error);
  }
})
const jumlahSiswa = ref<number>(0)
const mataPelajaran = ref<number>(0)
const rataRataNilai = ref<number>(0)

</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #eef2f7;
  padding: 20px;
  box-sizing: border-box;
}

.stat-grid {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.stat-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  background: #ffffff;
  text-align: center;
  width: 220px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.stat-card p {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}
</style>