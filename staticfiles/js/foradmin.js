const BACKEND_BASE = "http://127.0.0.1:8000";
const CRUD_BASE_URL = `${BACKEND_BASE}/management/api/locations/`;
const LOGIN_PAGE_URL = `${BACKEND_BASE}/management/login/`;

let localData = [];

window.onload = fetchAdminData;

async function fetchAdminData() {
    try {
        const res = await fetch(CRUD_BASE_URL, { credentials: 'include' });
        if (!res.ok) throw new Error();
        localData = await res.json();
        renderTable(localData);
    } catch {
        document.getElementById('admin-table-body').innerHTML =
            `<tr><td colspan="6" class="px-6 py-4 text-center text-red-600 font-medium">Server bilan ulanishda xatolik yoki ruxsat yo'q.</td></tr>`;
    }
}

function renderTable(data) {
    const tbody = document.getElementById('admin-table-body');
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-gray-400">Ma'lumot topilmadi</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map(item => {
        const imageUrl = item.image
            ? (item.image.startsWith('http') ? item.image : BACKEND_BASE + item.image)
            : null;
        return `
        <tr class="hover:bg-[#f4ebd9]/30 transition">
            <td class="px-6 py-4 font-mono text-xs text-gray-400">#${item.id}</td>
            <td class="px-6 py-4">
                ${imageUrl
                    ? `<img src="${imageUrl}" class="w-12 h-12 object-cover rounded-lg border border-[#e6d5ba]">`
                    : `<div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No img</div>`}
            </td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">${item.category}</span>
            </td>
            <td class="px-6 py-4 font-semibold text-gray-900">${item.name}</td>
            <td class="px-6 py-4 font-mono text-xs text-gray-500">${item.lat}, ${item.lon}</td>
            <td class="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                <button onclick="openEditModal(${item.id})" class="text-amber-700 hover:text-amber-900 text-sm font-semibold cursor-pointer">
                    <i class="fa-solid fa-pen-to-square mr-1"></i>Edit
                </button>
                <button onclick="deleteLocationItem(${item.id})" class="text-red-600 hover:text-red-800 text-sm font-semibold cursor-pointer">
                    <i class="fa-solid fa-trash mr-1"></i>O'chirish
                </button>
            </td>
        </tr>`;
    }).join('');
}

function filterTableData() {
    const search = document.getElementById('admin-search').value.toLowerCase();
    const category = document.getElementById('admin-filter').value;
    renderTable(localData.filter(item =>
        item.name.toLowerCase().includes(search) &&
        (category === '' || item.category === category)
    ));
}

function openFormModal() {
    document.getElementById('crud-form').reset();
    document.getElementById('form-id').value = '';
    document.getElementById('modal-title').innerText = "Yangi joy qo'shish";
    document.getElementById('crud-modal').classList.remove('hidden');
}

function closeFormModal() {
    document.getElementById('crud-modal').classList.add('hidden');
}

function openEditModal(id) {
    const item = localData.find(i => i.id === id);
    if (!item) return;
    document.getElementById('form-id').value = item.id;
    document.getElementById('form-name').value = item.name;
    document.getElementById('form-category').value = item.category;
    document.getElementById('form-lat').value = item.lat;
    document.getElementById('form-lon').value = item.lon;
    document.getElementById('form-description').value = item.description || '';
    document.getElementById('modal-title').innerText = 'Lokatsiyani tahrirlash';
    document.getElementById('crud-modal').classList.remove('hidden');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('form-id').value;

    const formData = new FormData();
    formData.append('name', document.getElementById('form-name').value);
    formData.append('category', document.getElementById('form-category').value);
    formData.append('lat', parseFloat(document.getElementById('form-lat').value));
    formData.append('lon', parseFloat(document.getElementById('form-lon').value));
    formData.append('description', document.getElementById('form-description').value);

    const fileInput = document.getElementById('form-image');
    if (fileInput.files.length > 0) formData.append('image', fileInput.files[0]);

    const url = id ? `${CRUD_BASE_URL}${id}/update/` : `${CRUD_BASE_URL}create/`;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            body: formData,
            credentials: 'include',
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        });
        if (res.ok) {
            closeFormModal();
            fetchAdminData();
        } else {
            alert(`Xatolik! Ma'lumotlarni saqlab bo'lmadi. (Status: ${res.status})`);
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteLocationItem(id) {
    if (!confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    try {
        const res = await fetch(`${CRUD_BASE_URL}${id}/delete/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        });
        if (res.ok) fetchAdminData();
        else alert("O'chirishda xatolik yuz berdi.");
    } catch (err) {
        console.error(err);
    }
}

function handleLogout() {
    window.location.href = LOGIN_PAGE_URL;
}

function getCookie(name) {
    for (const cookie of document.cookie.split(';')) {
        const [key, val] = cookie.trim().split('=');
        if (key === name) return decodeURIComponent(val);
    }
    return null;
}