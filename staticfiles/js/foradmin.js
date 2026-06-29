const BACKEND_BASE = window.location.origin;
const CRUD_BASE_URL = `${BACKEND_BASE}/management/api/locations/`;

const CATEGORY_LABELS = {
    stadium: 'Mini-stadion',
    playstation: 'Playstation',
    pc_club: 'Kompyuter klub',
    billiard: 'Billiard',
};

let localData = [];

// ─── INIT ────────────────────────────────────────────────────────
window.onload = fetchAdminData;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFormModal();
});

// ─── DATA ────────────────────────────────────────────────────────
async function fetchAdminData() {
    try {
        const res = await fetch(CRUD_BASE_URL, { credentials: 'include' });

        if (res.status === 401 || res.status === 403) {
            window.location.href = `${BACKEND_BASE}/management/login/`;
            return;
        }

        if (!res.ok) throw new Error(`Server xatosi: ${res.status}`);

        localData = await res.json();
        renderTable(localData);

    } catch (err) {
        console.error(err);
        setTableError('Server bilan ulanishda xatolik yuz berdi.');
    }
}

// ─── RENDER ──────────────────────────────────────────────────────
function renderTable(data) {
    const tbody = document.getElementById('admin-table-body');

    if (!data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-10 text-center text-gray-400">
                    <i class="fa-solid fa-inbox text-2xl mb-2 block"></i>
                    Ma'lumot topilmadi
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => {
        const imageUrl = item.image
            ? (item.image.startsWith('http') ? item.image : BACKEND_BASE + item.image)
            : null;

        const categoryLabel = CATEGORY_LABELS[item.category] || item.category;

        return `
        <tr class="hover:bg-[#f4ebd9]/30 transition">
            <td class="px-6 py-4 font-mono text-xs text-gray-400">#${item.id}</td>
            <td class="px-6 py-4">
                ${imageUrl
                    ? `<img src="${imageUrl}" class="w-12 h-12 object-cover rounded-lg border border-[#e6d5ba]" alt="${escapeHtml(item.name)}">`
                    : `<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                           <i class="fa-solid fa-image text-sm"></i>
                       </div>`
                }
            </td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    ${categoryLabel}
                </span>
            </td>
            <td class="px-6 py-4 font-semibold text-gray-900">${escapeHtml(item.name)}</td>
            <td class="px-6 py-4 font-mono text-xs text-gray-500">${item.lat}, ${item.lon}</td>
            <td class="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                <button onclick="openEditModal(${item.id})"
                    class="text-amber-700 hover:text-amber-900 text-sm font-semibold cursor-pointer">
                    <i class="fa-solid fa-pen-to-square mr-1"></i>Edit
                </button>
                <button onclick="deleteLocationItem(${item.id})"
                    class="text-red-600 hover:text-red-800 text-sm font-semibold cursor-pointer">
                    <i class="fa-solid fa-trash mr-1"></i>O'chirish
                </button>
            </td>
        </tr>`;
    }).join('');
}

function setTableError(msg) {
    document.getElementById('admin-table-body').innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-10 text-center text-red-500 font-medium">
                <i class="fa-solid fa-triangle-exclamation text-2xl mb-2 block"></i>
                ${msg}
            </td>
        </tr>`;
}

// ─── FILTER ──────────────────────────────────────────────────────
function filterTableData() {
    const search = document.getElementById('admin-search').value.toLowerCase().trim();
    const category = document.getElementById('admin-filter').value;

    renderTable(localData.filter(item =>
        item.name.toLowerCase().includes(search) &&
        (category === '' || item.category === category)
    ));
}

// ─── MODAL ───────────────────────────────────────────────────────
function openFormModal() {
    document.getElementById('crud-form').reset();
    document.getElementById('form-id').value = '';
    document.getElementById('modal-title').innerText = "Yangi joy qo'shish";
    document.getElementById('submit-btn').innerText = 'Saqlash';
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
    document.getElementById('submit-btn').innerText = 'Saqlash';
    document.getElementById('crud-modal').classList.remove('hidden');
}

// ─── CRUD ────────────────────────────────────────────────────────
async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('form-id').value;
    const submitBtn = document.getElementById('submit-btn');

    const formData = new FormData();
    formData.append('name',        document.getElementById('form-name').value.trim());
    formData.append('category',    document.getElementById('form-category').value);
    formData.append('lat',         parseFloat(document.getElementById('form-lat').value));
    formData.append('lon',         parseFloat(document.getElementById('form-lon').value));
    formData.append('description', document.getElementById('form-description').value.trim());

    const fileInput = document.getElementById('form-image');
    if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]);
    }

    const url    = id ? `${CRUD_BASE_URL}${id}/update/` : `${CRUD_BASE_URL}create/`;
    const method = id ? 'PATCH' : 'POST';

    submitBtn.disabled  = true;
    submitBtn.innerText = 'Saqlanmoqda...';

    try {
        const res = await fetch(url, {
            method,
            body: formData,
            credentials: 'include',
            headers: { 'X-CSRFToken': getCookie('csrftoken') },
        });

        if (res.ok) {
            closeFormModal();
            await fetchAdminData();
        } else {
            const errData = await res.json().catch(() => null);
            const msg = errData ? JSON.stringify(errData) : `Status: ${res.status}`;
            alert(`Xatolik! Ma'lumotlarni saqlab bo'lmadi.\n${msg}`);
        }
    } catch (err) {
        console.error(err);
        alert('Tarmoq xatosi. Internet aloqasini tekshiring.');
    } finally {
        submitBtn.disabled  = false;
        submitBtn.innerText = 'Saqlash';
    }
}

async function deleteLocationItem(id) {
    if (!confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;

    try {
        const res = await fetch(`${CRUD_BASE_URL}${id}/delete/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'X-CSRFToken': getCookie('csrftoken') },
        });

        if (res.ok) {
            await fetchAdminData();
        } else {
            alert("O'chirishda xatolik yuz berdi.");
        }
    } catch (err) {
        console.error(err);
        alert('Tarmoq xatosi. Internet aloqasini tekshiring.');
    }
}

// ─── HELPERS ─────────────────────────────────────────────────────
function getCookie(name) {
    for (const cookie of document.cookie.split(';')) {
        const [key, val] = cookie.trim().split('=');
        if (key === name) return decodeURIComponent(val);
    }
    return null;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}