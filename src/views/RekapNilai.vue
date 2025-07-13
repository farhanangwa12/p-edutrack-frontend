<template>
  <div class="wrap">
    <button @click="tambahData">Tambah</button>
    <button @click="exportToExcel">Export to Excel</button>
    <table class="styled-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama Siswa</th>
          <th>Subject</th>
          <th>Nilai</th>
          <th>Waktu Input</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="grade in dataGrades" :key="grade.id">
          <td>{{ grade.id }}</td>
          <td>{{ grade.nama_siswa }}</td>
          <td>{{ grade.subject }}</td>
          <td>{{ grade.score }}</td>
          <td>{{ formatDateTime(grade.created_at) }}</td>
          <td>
            <button @click="editData(grade.id)">Edit</button>
            <button @click="hapusData(grade.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>


    <div id="tambah" class="modal" v-bind:style="modal.tambahModal.open ? '' : 'display: none;'">
      <div class="modal-content">
        <span class="close" @click="modal.tambahModal.open = false">&times;</span>
        <h2>Tambah Nilai</h2>
        <form @submit.prevent="simpanData">
          <select v-model="tambahForm.nama_siswa" required>
            <option value="">-- Pilih Siswa --</option>
            <option v-for="siswa in dataSiswa" :key="siswa.id" :value="siswa.id">
              {{ siswa.name }}
            </option>
          </select>

          <select v-model="tambahForm.subject" required>
            <option value="">-- Pilih Subject --</option>
            <option v-for="subject in dataMapel" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>

          <input v-model.number="tambahForm.score" type="number" placeholder="Score" required />
          <button type="submit">Simpan</button>
        </form>
      </div>
    </div>
    <!-- Modal Edit -->
    <div id="myModal" class="modal" v-bind:style="modal.editModal.open ? '' : 'display: none;'">
      <div class="modal-content">
        <span class="close" @click="modal.editModal.open = false">&times;</span>
        <h2>Edit Nilai</h2>
        <form @submit.prevent="updateData">
          <label>ID</label>
          <input type="text" name="id" v-model="editForm.id" readonly />
          <select v-model="editForm.nama_siswa" required>
            <option value="">-- Pilih Siswa --</option>
            <option v-for="siswa in dataSiswa" :key="siswa.id" :value="siswa.id">
              {{ siswa.name }}
            </option>
          </select>

          <select v-model="editForm.subject" required>
            <option value="">-- Pilih Subject --</option>
            <option v-for="subject in dataMapel" :key="subject.id" :value="subject.name">
              {{ subject.name }}
            </option>
          </select>

          <input v-model.number="editForm.score" type="number" placeholder="Score" required />
          <button type="submit">Simpan</button>
        </form>
      </div>
    </div>

    <!-- Modal Hapus -->
    <div id="deleteModal" class="modal" v-bind:style="modal.deleteModal.open ? '' : 'display:none;'">
      <div class="modal-content">
        <span class="close" @click="modal.deleteModal.open = false">&times;</span>
        <h2>Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus data ini?</p>
        <button @click="deleteData(hapusForm)">Ya, Hapus</button>
        <button @click="modal.deleteModal.open = false">Batal</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import * as XLSX from 'xlsx';


interface Grade {
  id: number;
  id_student: number;
  nama_siswa: string;
  id_subject: number;
  subject: string;
  score: number;
  created_at: string;
}
interface Siswa {
  id: number,
  name: string,
  nisn: string,
  gender: string,
  birth_date: string

}
interface Mapel {
  id: number,
  name: string
}
const tambahForm = reactive<{ nama_siswa: number, subject: number, score: number, created_at: string }>({
  nama_siswa: 0,
  subject: 0,
  score: 0,
  created_at: ''
});
const editForm = reactive<{ id: number, nama_siswa: number, subject: number, score: number, created_at: string }>(
  {
    id: 0,
    nama_siswa: 0,
    subject: 0,
    score: 0,
    created_at: ''
  }
)

const hapusForm = ref<number>(0);
const dataGrades = ref<Grade[]>([]);
const dataSiswa = ref<Siswa[]>([]);
const dataMapel = ref<Mapel[]>([]);
const modal = reactive({
  editModal: { open: false },
  deleteModal: { open: false },
  tambahModal: { open: false }
});

onMounted(async () => {

  await getAllMapel();
  await getAllSiswa();
  await getAllScore();
});


function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
async function getAllSiswa() {
  const dataSiswaRes = await fetch('http://127.0.0.1:8000/api/students');
  const result = await dataSiswaRes.json();
  dataSiswa.value = result;

}
async function getAllMapel() {
  const dataMapelRes = await fetch('http://127.0.0.1:8000/api/subjects');
  const result = await dataMapelRes.json();
  dataMapel.value = result;
}
async function getAllScore() {
  const dataScoreRes = await fetch('http://127.0.0.1:8000/api/grades', {
    headers: {
      'Accept': 'application/json'
    }
  });
  const result = await dataScoreRes.json();
  dataGrades.value = result;
  console.log(result);
}

function editData(id: number) {
  modal.editModal.open = true;
  const filterEditData = dataGrades.value.find(item => item.id === id);
  if (filterEditData) {

    const siswaFilter = dataSiswa.value.find(item => item.id === filterEditData.id_student);
    const mapelFilter = dataMapel.value.find(item => item.id === filterEditData.id_subject);
    editForm.id = filterEditData.id;
    editForm.nama_siswa = siswaFilter?.id ?? 0;
    editForm.subject = mapelFilter?.id ?? 0;
    editForm.score = filterEditData.score;
    editForm.created_at = filterEditData.created_at;

  } else {
    alert('Data tidak valid');
  }
}

function hapusData(id: number) {
  modal.deleteModal.open = true;
  hapusForm.value = id;
}

function tambahData() {
  modal.tambahModal.open = true;
}



async function simpanData() {
  try {
    console.log(tambahForm);
    const result = await axios.post('http://127.0.0.1:8000/api/grades', {
      student_id: tambahForm.nama_siswa,
      subject_id: tambahForm.subject,
      score: tambahForm.score,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await getAllScore();
    alert('Berhasil menyimpan data!');
    tambahForm.nama_siswa = 0;
    tambahForm.subject = 0;
    tambahForm.score = 0;
    modal.tambahModal.open = false;

  } catch (error) {

    alert('Gagal menyimpan data!');
    console.log(error);
  }
}
async function updateData() {
  try {
    const result = await axios.put(`http://127.0.0.1:8000/api/grades/${editForm.id}`, {
      id: editForm.id,
      student_id: editForm.nama_siswa,
      subject_id: editForm.subject,
      score: editForm.score,

    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    await getAllScore();

    alert('Berhasil memperbarui data!');
    editForm.id = 0;
    editForm.nama_siswa = 0;
    editForm.subject = 0;
    editForm.score = 0;
    modal.editModal.open = false;
  } catch (error) {
    alert('Gagal memperbarui data!');
    console.log(error);
  }
}

async function deleteData(id: number | null) {

  try {
    const result = await axios.delete(`http://127.0.0.1:8000/api/grades/${id}`, {
      data: {
        id

      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    alert('Berhasil menghapus data');
    await getAllScore();
    hapusForm.value = 0;
    modal.deleteModal.open = false;

  } catch (error) {
    console.log(error);

  }
}
function exportToExcel() {
  const selectedShowData = dataGrades.value.map(item => ({
    id: item.id,
    'Nama Siswa': item.nama_siswa,
    'Mata Pelajaran': item.subject,
    'Nilai': item.score
  }) );
  const worksheet = XLSX.utils.json_to_sheet(selectedShowData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Grades');

  XLSX.writeFile(workbook, 'data_grades.xlsx');
}
</script>

<style scoped>
.wrap {
  padding: 20px;
  background: white;
  height: 100%;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
  min-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.styled-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
  border: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.modal {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  margin: 10% auto;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

form {
  display: flex;
  flex-direction: column;
}

.close {
  float: right;
  font-size: 24px;
  cursor: pointer;
}

button {
  margin-top: 10px;
  margin-right: 5px;
  padding: 8px 16px;
}
</style>
