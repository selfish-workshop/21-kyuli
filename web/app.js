// ── 샘플 데이터 ──
const PLACES = [
  {
    id: 1,
    name: '떡방앗간',
    emoji: '🍡',
    address: '서울 은평구 불광동 45-2',
    hours: '09:00 – 19:00',
    desc: '3대째 이어온 전통 방앗간. 버터떡은 오전 중에 매진되니 일찍 방문하세요.',
    lat: 37.6095,
    lng: 126.9318,
  },
  {
    id: 2,
    name: '버터떡집',
    emoji: '🧈',
    address: '서울 마포구 연남동 123-4',
    hours: '10:00 – 21:00',
    desc: '버터를 듬뿍 넣은 쫄깃한 떡이 일품. 줄 서서 먹는 연남동 대표 버터떡 맛집.',
    lat: 37.5651,
    lng: 126.9237,
  },
  {
    id: 3,
    name: '꿀버터떡',
    emoji: '🍯',
    address: '서울 성동구 성수동 88-3',
    hours: '11:00 – 20:00',
    desc: '꿀과 버터의 황금 조합. 성수 감성 카페 거리에 위치한 인스타 핫플.',
    lat: 37.5445,
    lng: 127.0557,
  },
  {
    id: 4,
    name: '쑥버터떡',
    emoji: '🌿',
    address: '서울 종로구 익선동 22-1',
    hours: '12:00 – 22:00',
    desc: '국산 쑥을 넣은 초록빛 버터떡. 고소한 버터 향과 쑥 향의 조화가 매력적.',
    lat: 37.5743,
    lng: 126.9983,
  },
  {
    id: 5,
    name: '말차버터떡',
    emoji: '🍵',
    address: '서울 강남구 신사동 514-5',
    hours: '11:00 – 21:00',
    desc: '일본산 말차와 국내산 버터의 만남. 가로수길 산책 중 들르기 좋은 곳.',
    lat: 37.5256,
    lng: 127.0237,
  },
  {
    id: 6,
    name: '흑임자버터떡',
    emoji: '🖤',
    address: '서울 송파구 방이동 12-8',
    hours: '10:00 – 20:00',
    desc: '고소한 흑임자와 짭조름한 버터의 조화. 잠실 올림픽공원 인근 숨은 맛집.',
    lat: 37.5122,
    lng: 127.1020,
  },
];

// ── 상태 ──
let map;
let markers = [];
let favorites = JSON.parse(localStorage.getItem('btm_favs') || '[]');
let userPlaces = JSON.parse(localStorage.getItem('btm_user_places') || '[]');
let currentPlaceId = null;

// ── 등록 상태 ──
let pickingLocation = false;
let selectedLat = null;
let selectedLng = null;
let selectedEmoji = '🍡';
let tempMarker = null;

// ── 전체 맛집 목록 ──
function allPlaces() {
  return [...PLACES, ...userPlaces];
}

// ── 지도 초기화 ──
function initMap() {
  map = L.map('map', {
    center: [37.5665, 126.9780],
    zoom: 12,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // 위치 선택 클릭 이벤트
  map.on('click', (e) => {
    if (!pickingLocation) return;
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;

    if (tempMarker) map.removeLayer(tempMarker);
    tempMarker = L.marker([selectedLat, selectedLng]).addTo(map);

    document.getElementById('locationPreview').textContent =
      `📍 위도 ${selectedLat.toFixed(5)}, 경도 ${selectedLng.toFixed(5)}`;
    document.getElementById('locationPreview').classList.add('selected');
    document.getElementById('stepNextBtn').disabled = false;
  });

  renderMarkers(allPlaces());
}

// ── 마커 렌더링 ──
function renderMarkers(places) {
  markers.forEach(m => map.removeLayer(m.layer));
  markers = [];

  places.forEach(place => {
    const isFav = favorites.includes(place.id);
    const isUser = place.userAdded;
    const icon = L.divIcon({
      className: '',
      html: `<div class="custom-marker ${isFav ? 'favorited' : ''}">${place.emoji} ${place.name}${isUser ? ' ✨' : ''}</div>`,
      iconAnchor: [0, 36],
    });

    const layer = L.marker([place.lat, place.lng], { icon })
      .addTo(map)
      .on('click', () => openSheet(place.id));

    markers.push({ id: place.id, layer });
  });
}

// ── 맛집 등록 ──
function startRegister() {
  const fab = document.getElementById('fabAdd');
  const modal = document.getElementById('registerModal');
  const overlay = document.getElementById('modalOverlay');
  const banner = document.getElementById('pickBanner');

  fab.classList.add('active');
  modal.classList.add('open');
  overlay.classList.add('show');
  banner.classList.add('show');
  document.getElementById('map').classList.add('picking');
  pickingLocation = true;

  // 초기화
  selectedLat = null; selectedLng = null;
  document.getElementById('locationPreview').textContent = '📍 위치를 선택하면 여기에 표시돼요';
  document.getElementById('locationPreview').classList.remove('selected');
  document.getElementById('stepNextBtn').disabled = true;
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
  if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }

  // 이모지 초기화
  selectedEmoji = '🍡';
  document.querySelectorAll('.emoji-opt').forEach(el => el.classList.remove('selected'));
  document.querySelector('.emoji-opt').classList.add('selected');

  // 폼 초기화
  ['regName','regAddress','regHours','regDesc'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function cancelRegister() {
  document.getElementById('fabAdd').classList.remove('active');
  document.getElementById('registerModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('show');
  document.getElementById('pickBanner').classList.remove('show');
  document.getElementById('map').classList.remove('picking');
  pickingLocation = false;
  if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }
}

function goToStep2() {
  if (!selectedLat) return;
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
  document.getElementById('pickBanner').classList.remove('show');
  document.getElementById('map').classList.remove('picking');
  pickingLocation = false;
}

function goToStep1() {
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('pickBanner').classList.add('show');
  document.getElementById('map').classList.add('picking');
  pickingLocation = true;
}

function selectEmoji(el) {
  document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  selectedEmoji = el.textContent;
}

function submitRegister() {
  const name = document.getElementById('regName').value.trim();
  const address = document.getElementById('regAddress').value.trim();
  const hours = document.getElementById('regHours').value.trim() || '정보 없음';
  const desc = document.getElementById('regDesc').value.trim() || '유저가 등록한 맛집이에요.';

  if (!name) { document.getElementById('regName').focus(); return; }
  if (!address) { document.getElementById('regAddress').focus(); return; }

  const newPlace = {
    id: Date.now(),
    name,
    emoji: selectedEmoji,
    address,
    hours,
    desc,
    lat: selectedLat,
    lng: selectedLng,
    userAdded: true,
  };

  userPlaces.push(newPlace);
  localStorage.setItem('btm_user_places', JSON.stringify(userPlaces));

  cancelRegister();
  renderMarkers(allPlaces());

  // 등록된 위치로 지도 이동 후 시트 열기
  map.setView([newPlace.lat, newPlace.lng], 15);
  setTimeout(() => openSheet(newPlace.id), 400);
}

// ── 하단 시트 ──
function openSheet(placeId) {
  const place = PLACES.find(p => p.id === placeId);
  if (!place) return;
  currentPlaceId = placeId;

  document.getElementById('sheetHero').textContent = place.emoji;
  document.getElementById('sheetName').textContent = place.name;
  document.getElementById('sheetAddress').textContent = place.address;
  document.getElementById('sheetHours').textContent = place.hours;
  document.getElementById('sheetDesc').textContent = place.desc;

  const favBtn = document.getElementById('favBtn');
  favBtn.className = 'fav-btn' + (favorites.includes(placeId) ? ' active' : '');

  document.getElementById('naviBtn').onclick = () => {
    window.open(`https://www.google.com/maps?q=${place.lat},${place.lng}`, '_blank');
  };

  document.getElementById('bottomSheet').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}

function closeSheet() {
  document.getElementById('bottomSheet').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  currentPlaceId = null;
}

// ── 즐겨찾기 ──
function toggleFav() {
  if (!currentPlaceId) return;
  const idx = favorites.indexOf(currentPlaceId);
  if (idx >= 0) {
    favorites.splice(idx, 1);
  } else {
    favorites.push(currentPlaceId);
  }
  localStorage.setItem('btm_favs', JSON.stringify(favorites));

  const favBtn = document.getElementById('favBtn');
  favBtn.className = 'fav-btn' + (favorites.includes(currentPlaceId) ? ' active' : '');

  updateFavTabBtn();
  renderMarkers(getCurrentSearchResults());
  renderFavList();
}

function updateFavTabBtn() {
  const btn = document.getElementById('favTabBtn');
  if (favorites.length > 0) {
    btn.textContent = '🧡';
    btn.classList.add('has-fav');
  } else {
    btn.textContent = '🤍';
    btn.classList.remove('has-fav');
  }
}

// ── 즐겨찾기 패널 ──
function openFavPanel() {
  renderFavList();
  document.getElementById('favPanel').classList.add('open');
}

function closeFavPanel() {
  document.getElementById('favPanel').classList.remove('open');
}

function renderFavList() {
  const list = document.getElementById('favList');
  const favPlaces = PLACES.filter(p => favorites.includes(p.id));

  if (favPlaces.length === 0) {
    list.innerHTML = '<div class="fav-empty">아직 즐겨찾기한 맛집이 없어요.<br>지도에서 하트를 눌러보세요 🤍</div>';
    return;
  }

  list.innerHTML = favPlaces.map(p => `
    <div class="fav-item" onclick="closeFavPanel(); openSheet(${p.id})">
      <span class="fav-emoji">${p.emoji}</span>
      <div class="fav-info">
        <div class="fav-name">${p.name}</div>
        <div class="fav-addr">${p.address}</div>
      </div>
    </div>
  `).join('');
}

// ── 검색 ──
let searchQuery = '';

function getCurrentSearchResults() {
  if (!searchQuery) return allPlaces();
  return allPlaces().filter(p =>
    p.name.includes(searchQuery) || p.address.includes(searchQuery)
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  updateFavTabBtn();

  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  const noResult = document.createElement('div');
  noResult.className = 'no-result';
  noResult.textContent = '검색 결과가 없어요 🍡';
  document.body.appendChild(noResult);

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    clearBtn.style.display = searchQuery ? 'block' : 'none';

    const results = getCurrentSearchResults();
    renderMarkers(results);

    noResult.style.display = results.length === 0 ? 'block' : 'none';

    if (results.length > 0) {
      const bounds = L.latLngBounds(results.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearBtn.style.display = 'none';
    noResult.style.display = 'none';
    renderMarkers(PLACES);
    map.setView([37.5665, 126.9780], 12);
  });

  document.getElementById('favTabBtn').addEventListener('click', () => {
    const panel = document.getElementById('favPanel');
    if (panel.classList.contains('open')) {
      closeFavPanel();
    } else {
      openFavPanel();
    }
  });
});
