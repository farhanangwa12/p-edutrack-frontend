<template>

    <div class="wrap">
        <button @click="tambahData">Tambah</button>

        <table class="styled-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="mapel in dataMapel">
                    <td>{{ mapel.id }}</td>
                    <td>{{ mapel.name }}</td>

                    <td> <button @click="editData(mapel.id)">Edit</button><button
                            @click="hapusData(mapel.id)">Hapus</button></td>
                </tr>

            </tbody>
        </table>


        <div id="tambah" class="modal" v-bind:style="modal.tambahModal.open ? '' : 'display: none;'">
            <div class="modal-content">
                <span class="close" @click="modal.tambahModal.open = false">&times;</span>
                <h2>Tambah Mata Pelajaran</h2>
                <form>

                    <label>Name</label>
                    <input type="text" name="name" v-model="tambahForm.name" />
                    <button type="button" @click="simpanData">Simpan</button>
                </form>
            </div>
        </div>

        <!-- Modal -->
        <div id="myModal" class="modal" v-bind:style="modal.editModal.open ? '' : 'display: none;'">
            <div class="modal-content">
                <span class="close" @click="modal.editModal.open = false">&times;</span>
                <h2>Edit Mata Pelajaran</h2>
                <form>
                    <label>ID</label>
                    <input type="text" name="id" v-model="editForm.id" readonly />

                    <label>Name</label>
                    <input type="text" name="name" v-model="editForm.name" />
                    <button type="button" @click="updateData">Simpan</button>
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
import axios from 'axios';
import { onMounted, reactive, ref, watch } from 'vue';


interface Mapel {
    id: number,
    name: string
}

const tambahForm = reactive<{ name: string }>({
    name: ''
});

const editForm = reactive<{ id: number | null, name: string }>(
    {
        id: null,
        name: ''
    }
)

const hapusForm = ref<number | null>(null);
const dataMapel = ref<Mapel[]>([]);

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

onMounted(async () => {

    await getAllMapel();
});


async function getAllMapel() {
    const dataMapelRes = await fetch('http://127.0.0.1:8000/api/subjects');
    const result = await dataMapelRes.json();
    dataMapel.value = result;
}
function editData(id: number) {
    modal.editModal.open = true;
    const filterEditData = dataMapel.value.find(item => item.id === id);
    if (filterEditData) {
        editForm.id = filterEditData.id;
        editForm.name = filterEditData.name;

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
        const result = await axios.post('http://127.0.0.1:8000/api/subjects', {
            name: tambahForm.name
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await getAllMapel();
        alert('Berhasil menyimpan data!');
        tambahForm.name = '';
        modal.tambahModal.open = false;

    } catch (error) {

        alert('Gagal menyimpan data!');
        console.log(error);
    }
}
async function updateData() {
    try {
        const result = await axios.put(`http://127.0.0.1:8000/api/subjects/${editForm.id}`, {
            id: editForm.id,
            name: editForm.name,

        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        await getAllMapel();

        alert('Berhasil memperbarui data!');
        editForm.id = null;
        editForm.name = '';
        modal.editModal.open = false;
    } catch (error) {
        alert('Gagal memperbarui data!');
        console.log(error);
    }
}

async function deleteData(id: number | null) {

    try {
        const result = await axios.delete(`http://127.0.0.1:8000/api/subjects/${id}`, {
            data: {
                id

            },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        alert('Berhasil menghapus data');
        await getAllMapel();
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