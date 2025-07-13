<template>

    <div class="wrap">
        <button @click="tambahData">Tambah</button>
        <table class="styled-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>NISN</th>
                    <th>Gender</th>
                    <th>Birth Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2">NAMA</td>
                    <td><input type="text" v-model="namaSearch"></td>
                    <td colspan="2">NISN</td>
                    <td><input type="text" v-model="nisSearch"></td>

                </tr>


                <tr v-for="siswa in filteredData">
                    <td>{{ siswa.id }}</td>
                    <td>{{ siswa.name }}</td>
                    <td>{{ siswa.nisn }}</td>
                    <td>{{ siswa.gender }}</td>
                    <td>{{ siswa.birth_date }}</td>
                    <td> <button @click="editData(siswa.id)">Edit</button><button
                            @click="hapusData(siswa.id)">Hapus</button></td>
                </tr>

            </tbody>
        </table>




        <div id="tambah" class="modal" v-bind:style="modal.tambahModal.open ? '' : 'display: none;'">
            <div class="modal-content">
                <span class="close" @click="modal.tambahModal.open = false">×</span>
                <h2>Tambah Siswa</h2>
                <form>
                    <label>Name</label>
                    <input type="text" name="name" v-model="addForm.name" />

                    <label>NISN</label>
                    <input type="text" name="nisn" v-model="addForm.nisn" />

                    <label>Gender</label>
                    <select name="gender" v-model="addForm.gender">
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>

                    <label>Birth Date</label>
                    <input type="date" name="birth_date" v-model="addForm.birth_date" />

                    <button type="button" @click="simpanData">Simpan</button>
                </form>
            </div>
        </div>

        <!-- Modal -->
        <div id="myModal" class="modal" v-bind:style="modal.editModal.open ? '' : 'display: none;'">
            <div class="modal-content">
                <span class="close" @click="modal.editModal.open = false">&times;</span>
                <h2>Edit Data Siswa</h2>
                <form>
                    <label>ID</label>
                    <input type="text" name="id" v-model="editForm.id" readonly />

                    <label>Name</label>
                    <input type="text" name="name" v-model="editForm.name" />

                    <label>NISN</label>
                    <input type="text" name="nisn" v-model="editForm.nisn" />

                    <label>Gender</label>
                    <select name="gender" v-model="editForm.gender">
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>

                    <label>Birth Date</label>
                    <input type="date" name="birth_date" v-model="editForm.birth_date" />

                    <button type="button" @click="updateData">Update</button>
                </form>
            </div>
        </div>


        <!-- Modal Hapus -->
        <div id="deleteModal" class="modal" v-bind:style="modal.deleteModal.open ? '' : 'display:none;'">
            <div class="modal-content">
                <span class="close" v-on:click="modal.deleteModal.open = false">&times;</span>
                <h2>Konfirmasi Hapus</h2>
                <p>Apakah Anda yakin ingin menghapus data ini?</p>
                <button @click="deleteData(hapusForm)">Ya, Hapus</button>
                <button v-on:click="modal.deleteModal.open = false">Batal</button>
            </div>
        </div>

    </div>

</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';

const namaSearch = ref<String>('');
const nisSearch = ref<String>('');
const dataSiswa = ref<Siswa[]>([

]);
const addForm = reactive<{ name: string, nisn: string, gender: string, birth_date: string }>({
    name: '',
    nisn: '',
    gender: 'L',
    birth_date: ''
});
const editForm = reactive<Siswa>({
    id: null,
    name: '',
    nisn: '',
    gender: '',
    birth_date: ''

});

const hapusForm = ref<number | null>(null);
interface Siswa {
    id: number | null,
    name: string,
    nisn: string,
    gender: string,
    birth_date: string
}



onMounted(async () => {

    // console.log(result);
    getAllSiswaData();
});

async function getAllSiswaData() {
    const dataSiswaFetch = await fetch('http://127.0.0.1:8000/api/students');
    const result = await dataSiswaFetch.json();
    dataSiswa.value = result;
}





const filteredData = computed(() => {
    return dataSiswa.value.filter(item => {
        const matchName = item.name.toLowerCase().includes(namaSearch.value.toLowerCase())
        const matchNisn = item.nisn.toLowerCase().includes(nisSearch.value.toLowerCase());

        return matchName && matchNisn;

    })
})
const modal = reactive({
    editModal: {
        open: false
    },
    deleteModal: {
        open: false
    },
    tambahModal: {
        open: false
    }
})


function editData(id: number | null) {
    modal.editModal.open = true;
    const filterEditData = dataSiswa.value.find(item => item.id === id);

    if (filterEditData) {
        editForm.id = filterEditData.id;
        editForm.name = filterEditData.name;
        editForm.gender = filterEditData.gender;
        editForm.nisn = filterEditData.nisn;
        editForm.birth_date = filterEditData.birth_date;
    } else {
        alert('Data tidak valid');
    }



}


function hapusData(id: number | null) {
    modal.deleteModal.open = true;
    hapusForm.value = id;
    // alert(hapusForm.value);

}
function tambahData() {
    modal.tambahModal.open = true;
}

async function simpanData() {
    // console.log('Nilai addForm:', JSON.stringify(addForm, null, 2)); // Cetak addForm dalam format JSON
    try {


        const result = await axios.post('http://127.0.0.1:8000/api/students', {
            name: addForm.name,
            nisn: addForm.nisn,
            gender: addForm.gender,
            birth_date: addForm.birth_date
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        alert('Berhasil menyimpan data!');
        addForm.name = '';
        addForm.nisn = '';
        addForm.gender = '';
        addForm.birth_date = '';

    } catch (error) {
        alert('Gagal menyimpan data!');
        console.log(error);
    }
}

async function updateData() {
    // console.log('Nilai addForm:', JSON.stringify(addForm, null, 2)); // Cetak addForm dalam format JSON
    try {



        const result = await axios.put(`http://127.0.0.1:8000/api/students/${editForm.id}`, {
            id: editForm.id,
            name: editForm.name,
            nisn: editForm.nisn,
            gender: editForm.gender,
            birth_date: editForm.birth_date
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        alert('Berhasil memperbarui data!');
        editForm.id = null;
        editForm.name = '';
        editForm.nisn = '';
        editForm.gender = '';
        editForm.birth_date = '';
        await getAllSiswaData();
        modal.editModal.open = false;

    } catch (error) {
        alert('Gagal memperbarui data!');
        console.log(error);
    }
}

async function deleteData(id: number | null) {

    try {
        const result = await axios.delete(`http://127.0.0.1:8000/api/students/${id}`, {
            data: {
                id

            },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        alert('Berhasil menghapus data');
        await getAllSiswaData();
        hapusForm.value = null;
        modal.deleteModal.open = false; 

    } catch (error) {
        console.log(error);

    }
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

.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
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