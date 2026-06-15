let myMap;
let activePlacemarks = [];
let myLocationPlacemark = null;

ymaps.ready(function () {
    myMap = new ymaps.Map('map', {
        center: [41.2995, 69.2401],
        zoom: 12,
        controls: []
    });

    loadLocations('');

    setTimeout(function () {
        const zoomCtrl = document.getElementById('zoomCtrl');
        if (zoomCtrl) zoomCtrl.style.display = 'flex';

        document.getElementById('zoomIn').onclick = function () {
            myMap.setZoom(myMap.getZoom() + 1, { smooth: true });
        };
        document.getElementById('zoomOut').onclick = function () {
            myMap.setZoom(myMap.getZoom() - 1, { smooth: true });
        };
    }, 500);
});


// ── Locations yuklash ──
function loadLocations(category) {
    activePlacemarks.forEach(p => myMap.geoObjects.remove(p));
    activePlacemarks = [];

    let url = '/head/api/locations/';
    if (category) url += '?category=' + category;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('Server xatosi: ' + res.status);
            return res.json();
        })
        .then(data => {
            if (typeof updateCount === 'function') updateCount(data.length);

            data.forEach(loc => {
                const placemark = new ymaps.Placemark(
                    [loc.lat, loc.lon],
                    { hintContent: loc.name },
                    {
                        iconLayout: 'default#image',
                        iconImageHref: '/static/images/img_1.png',
                        iconImageSize: [40, 50],
                        iconImageOffset: [-20, -50],
                    }
                );

                placemark.events.add('click', function () {
                    showPopup(loc);
                });

                myMap.geoObjects.add(placemark);
                activePlacemarks.push(placemark);
            });
        })
        .catch(err => {
            console.error('Locations yuklanmadi:', err);
        });
}


// ── Mening joylashuvim ──
function getMyLocation() {
    if (!navigator.geolocation) {
        alert("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => {
            const coords = [pos.coords.latitude, pos.coords.longitude];

            if (myLocationPlacemark) {
                myMap.geoObjects.remove(myLocationPlacemark);
            }

            myLocationPlacemark = new ymaps.Placemark(
                coords,
                { hintContent: 'Siz shu yerdasiz' },
                {
                    iconLayout: 'default#image',
                    iconImageHref: '/static/images/img.png',
                    iconImageSize: [48, 48],
                    iconImageOffset: [-24, -48],
                }
            );

            myMap.geoObjects.add(myLocationPlacemark);
            myMap.setCenter(coords, 15, { smooth: true });
        },
        err => {
            console.error('Geolokatsiya xatosi:', err);
            alert("Joylashuvni aniqlab bo'lmadi. Ruxsat bering yoki qayta urinib ko'ring.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}


// ── Popup ──
function showPopup(loc) {
    const old = document.getElementById('location-popup');
    if (old) old.remove();

    const catNames = {
        'stadium': 'Stadium',
        'playstation': 'Playstation',
        'pc_club': 'PC Club',
        'billiard': 'Billiard',
    };

    const popup = document.createElement('div');
    popup.id = 'location-popup';
    popup.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        width: 300px;
        background: #111827;
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 16px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.5);
        font-family: 'DM Sans', sans-serif;
        overflow: hidden;
    `;

    if (loc.image) {
        const img = document.createElement('img');
        img.src = loc.image;
        img.alt = loc.name;
        img.style.cssText = `
            width: 100%;
            height: 180px;
            object-fit: cover;
            display: block;
            border-radius: 12px 12px 0 0;
        `;
        img.onerror = function () { this.style.display = 'none'; };
        popup.appendChild(img);
    }

    const content = document.createElement('div');
    content.style.cssText = 'padding: 14px 16px 16px;';
    content.innerHTML = `
        <div style="
            display:inline-flex;
            align-items:center;
            gap:5px;
            background:rgba(239,68,68,0.12);
            color:#f87171;
            font-size:11px;
            font-weight:500;
            padding:3px 10px;
            border-radius:999px;
            margin-bottom:8px;">
            ${getCategoryEmoji(loc.category)} ${catNames[loc.category] || loc.category}
        </div>
        <div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:6px;">${loc.name}</div>
        ${loc.description ? `<div style="font-size:13px;color:#94a3b8;">${loc.description}</div>` : ''}
    `;
    popup.appendChild(content);

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position:absolute; top:10px; right:10px;
        width:28px; height:28px; border-radius:50%;
        background:rgba(0,0,0,0.55); border:none;
        color:white; font-size:18px; cursor:pointer;
    `;
    closeBtn.onclick = () => popup.remove();
    popup.appendChild(closeBtn);

    document.body.appendChild(popup);

    setTimeout(() => {
        myMap.events.addOnce('click', () => popup.remove());
    }, 100);
}


// ── Yordamchi funksiyalar ──
function getCategoryEmoji(category) {
    const emojis = {
        'stadium':     '🏟',
        'playstation': '🎮',
        'pc_club':     '💻',
        'billiard':    '🎱',
    };
    return emojis[category] || '📍';
}

function searchAddress() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    ymaps.geocode(query).then(res => {
        const firstObj = res.geoObjects.get(0);
        if (firstObj) {
            const coords = firstObj.geometry.getCoordinates();
            myMap.setCenter(coords, 15, { smooth: true });
        } else {
            alert("Manzil topilmadi.");
        }
    });
}

function filterSelect(btn, category) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadLocations(category);
}

function updateCount(n) {
    const el = document.getElementById('locationCount');
    if (el) el.textContent = n;
}


// ── Profile dropdown ──
document.addEventListener('DOMContentLoaded', function () {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('open');
        });

        // Faqat profile-wrap tashqarisiga bosilganda yopiladi
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.profile-wrap')) {
                profileDropdown.classList.remove('open');
            }
        });
    }
});


// ── Profile modal ──
function openProfileModal() {
    // Avval dropdownni yop
    document.getElementById('profileDropdown').classList.remove('open');
    // Keyin modalni och
    document.getElementById('profileModal').classList.add('open');
}

function closeModal() {
    document.getElementById('profileModal').classList.remove('open');
}

function closeProfileModal(e) {
    // Faqat overlay (qora fon) bosilganda yopiladi, modal ichiga bosish yopmaydi
    if (e.target === document.getElementById('profileModal')) {
        closeModal();
    }
}

// Esc tugmasi bilan yopish
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

// Avatar preview
function previewAvatar(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById('avatarPreview');
        preview.src = e.target.result;
        preview.style.display = 'block';
        document.getElementById('avatarInitials').style.display = 'none';

        // Asosiy forma fayliga ham o'tkazamiz
        const avatarFile = document.getElementById('avatarFile');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        avatarFile.files = dataTransfer.files;
    };
    reader.readAsDataURL(file);
}

