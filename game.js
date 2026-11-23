/* ===== ميلاند تايكون - منطق اللعبة ===== */

const PETS_DATA = [
  { id: 'cat', emoji: '🐱', name: 'قطة', basePrice: 50, income: 1, levels: 3 },
  { id: 'dog', emoji: '🐶', name: 'كلب', basePrice: 250, income: 5, levels: 3 },
  { id: 'bunny', emoji: '🐰', name: 'أرنب', basePrice: 1000, income: 15, levels: 3 },
  { id: 'fox', emoji: '🦊', name: 'ثعلب', basePrice: 5000, income: 60, levels: 3 },
  { id: 'dragon', emoji: '🐉', name: 'تنين', basePrice: 25000, income: 250, levels: 3 },
];

const UPGRADES_DATA = [
  { id: 'clickBoost', name: 'ضغط أقوى', cost: 100, effect: () => { clickPower += 1; save(); showToast('تم التطوير: ضغط أقوى!'); }, bought: 0, max: 10 },
  { id: 'incomeBoost', name: 'مضاعف الدخل', cost: 500, effect: () => { incomeMultiplier += 0.5; save(); showToast('تم التطوير: مضاعف الدخل!'); }, bought: 0, max: 5 },
];

let state = {
  coins: 0,
  incomePerSec: 0,
  level: 1,
  clickPower: 1,
  incomeMultiplier: 1,
  pets: [],
  upgrades: {},
  lastSave: Date.now(),
};

const els = {
  coinsValue: document.getElementById('coinsValue'),
  incomeValue: document.getElementById('incomeValue'),
  levelValue: document.getElementById('levelValue'),
  petsContainer: document.getElementById('petsContainer'),
  petsList: document.getElementById('petsList'),
  upgradesList: document.getElementById('upgradesList'),
  clickZone: document.getElementById('clickZone'),
  clickEffect: document.getElementById('clickEffect'),
  toast: document.getElementById('toast'),
  btnStart: document.getElementById('btnStart'),
};

function load() {
  try {
    const raw = localStorage.getItem('meeland_clone_save');
    if (raw) {
      const s = JSON.parse(raw);
      state = { ...state, ...s };
      state.upgrades = state.upgrades || {};
    }
  } catch (e) {
    console.error('فشل التحميل', e);
  }
}

function save() {
  try {
    state.lastSave = Date.now();
    localStorage.setItem('meeland_clone_save', JSON.stringify(state));
  } catch (e) {
    console.error('فشل الحفظ', e);
  }
}

function showToast(text) {
  const t = els.toast;
  t.textContent = text;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' ب';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + ' م';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + ' ألف';
  return Math.floor(n).toString();
}

function recomputeIncome() {
  let perSec = 0;
  state.pets.forEach(p => {
    const data = PETS_DATA.find(d => d.id === p.id);
    if (!data) return;
    const levelMultiplier = 1 + (p.level - 1) * 0.5;
    perSec += data.income * levelMultiplier * p.count;
  });
  perSec *= incomeMultiplier;
  state.incomePerSec = perSec;
}

function spawnPetDOM(pet) {
  const data = PETS_DATA.find(d => d.id === pet.id);
  const el = document.createElement('div');
  el.className = `pet level-${pet.level}`;
  el.style.left = (10 + Math.random() * 80) + '%';
  el.style.bottom = (10 + Math.random() * 60) + '%';
  el.textContent = data.emoji;
  el.title = `${data.name} (المستوى ${pet.level}) - ${fmt(data.income * (1 + (pet.level - 1) * 0.5))}/ثانية`;
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const gain = Math.floor(data.income * (1 + (pet.level - 1) * 0.5) * clickPower);
    state.coins += gain;
    showToast(`+${fmt(gain)}`);
    createFloatingText(el, `+${fmt(gain)}`);
    updateHUD();
    save();
  });
  els.petsContainer.appendChild(el);
  return el;
}

function createFloatingText(el, text) {
  const f = document.createElement('div');
  f.textContent = text;
  f.style.position = 'absolute';
  f.style.left = '50%';
  f.style.top = '0';
  f.style.transform = 'translate(-50%, -100%)';
  f.style.color = '#10b981';
  f.style.fontWeight = '900';
  f.style.fontSize = '16px';
  f.style.pointerEvents = 'none';
  f.style.textShadow = '0 1px 2px rgba(0,0,0,0.6)';
  el.appendChild(f);
  f.animate([
    { transform: 'translate(-50%, -100%)', opacity: 1 },
    { transform: 'translate(-50%, -140%)', opacity: 0 },
  ], { duration: 900, easing: 'ease-out' }).onfinish = () => f.remove();
}

function updateHUD() {
  els.coinsValue.textContent = fmt(state.coins);
  els.incomeValue.textContent = fmt(state.incomePerSec);
  els.levelValue.textContent = state.level;
}

function renderPets() {
  els.petsContainer.innerHTML = '';
  state.pets.forEach(p => {
    for (let i = 0; i < p.count; i++) spawnPetDOM(p);
  });
}

function renderShop() {
  els.petsList.innerHTML = '';
  PETS_DATA.forEach(data => {
    const owned = state.pets.find(p => p.id === data.id);
    const count = owned ? owned.count : 0;
    const price = data.basePrice * Math.pow(1.6, count);
    const item = document.createElement('div');
    item.className = `pet-item ${state.coins < price ? 'disabled' : ''}`;
    item.innerHTML = `
      <div class="info">
        <div class="name">${data.name} ${data.emoji}</div>
        <div class="price">السعر: ${fmt(Math.floor(price))} | الدخل: ${fmt(data.income)}/ثانية</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">المملوك: ${count}</div>
      </div>
      <div class="emoji">${data.emoji}</div>
      <button ${state.coins < price ? 'disabled' : ''}>اشتري</button>
    `;
    item.querySelector('button').addEventListener('click', () => buyPet(data.id));
    els.petsList.appendChild(item);
  });
  els.upgradesList.innerHTML = '';
  UPGRADES_DATA.forEach(upg => {
    const bought = state.upgrades[upg.id] || 0;
    if (bought >= upg.max) return;
    const cost = upg.cost * Math.pow(1.8, bought);
    const item = document.createElement('div');
    item.className = 'upgrade-item';
    item.innerHTML = `
      <div class="label">${upg.name} (المستوى ${bought + 1}/${upg.max}) - ${fmt(Math.floor(cost))}</div>
      <button ${state.coins < cost ? 'disabled' : ''}>اشتري</button>
    `;
    item.querySelector('button').addEventListener('click', () => buyUpgrade(upg.id));
    els.upgradesList.appendChild(item);
  });
}

function buyPet(id) {
  const data = PETS_DATA.find(d => d.id === id);
  const owned = state.pets.find(p => p.id === id);
  const count = owned ? owned.count : 0;
  const price = data.basePrice * Math.pow(1.6, count);
  if (state.coins < price) {
    showToast('ليس لديك عملات كافية!');
    return;
  }
  state.coins -= price;
  if (owned) {
    owned.count += 1;
  } else {
    state.pets.push({ id, level: 1, count: 1 });
  }
  recomputeIncome();
  updateHUD();
  renderPets();
  renderShop();
  save();
  showToast(`اشترِيت ${data.name}!`);
}

function buyUpgrade(id) {
  const upg = UPGRADES_DATA.find(u => u.id === id);
  const bought = state.upgrades[id] || 0;
  if (bought >= upg.max) return;
  const cost = upg.cost * Math.pow(1.8, bought);
  if (state.coins < cost) {
    showToast('ليس لديك عملات كافية!');
    return;
  }
  state.coins -= cost;
  state.upgrades[id] = bought + 1;
  upg.effect();
  updateHUD();
  renderShop();
  save();
}

let lastTime = Date.now();
function gameLoop() {
  const now = Date.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  state.coins += state.incomePerSec * dt;
  const newLevel = Math.floor(Math.log10(Math.max(state.coins, 1))) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    showToast(`وصلت إلى المستوى ${state.level}!`);
  }
  updateHUD();
  if (now - state.lastSave > 30000) save();
  requestAnimationFrame(gameLoop);
}

els.clickZone.addEventListener('click', () => {
  const gain = Math.floor(25 * clickPower * incomeMultiplier);
  state.coins += gain;
  createFloatingText(els.clickZone, `+${fmt(gain)}`);
  const effect = els.clickEffect;
  effect.style.left = '50%';
  effect.style.top = '50%';
  effect.style.animation = 'none';
  effect.offsetHeight;
  effect.style.animation = 'clickRipple 0.6s ease-out forwards';
  updateHUD();
  save();
  showToast(`+${fmt(gain)} مكافأة سريعة!`);
});

els.btnStart.addEventListener('click', () => {
  document.getElementById('splash').classList.remove('active');
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  document.getElementById('game').classList.add('active');
  init();
});

function init() {
  load();
  recomputeIncome();
  renderPets();
  renderShop();
  updateHUD();
  lastTime = Date.now();
  requestAnimationFrame(gameLoop);
  window.addEventListener('beforeunload', save);
}