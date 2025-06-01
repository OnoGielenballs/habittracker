const habitLogEl = document.getElementById('habit-log');
const homeScreen = document.getElementById('home-screen');
const detailScreen = document.getElementById('detail-screen');
const detailDateEl = document.getElementById('detail-date');
const weightInput = document.getElementById('weight-input');
const saveWeightBtn = document.getElementById('save-weight');
const weightStatus = document.getElementById('weight-status');
const backBtn = document.getElementById('back-to-home');

let habits = [];
let selectedIndex = null;

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function createHabitArray() {
  const today = getTodayStr();
  let arr = [];

  for (let i = 9; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Simuleer gewicht voor alle dagen behalve vandaag
    let gewicht = null;
    let status = "gemist";

    if (dateStr !== today) {
      // Voorbeeldgewicht 70-73 kg, 1 decimaal
      gewicht = parseFloat((70 + Math.random() * 3).toFixed(1));
      status = "gedaan";
    }

    // Check localStorage (prioriteit)
    const storedWeight = localStorage.getItem(`weight-${dateStr}`);
    if (storedWeight !== null) {
      gewicht = parseFloat(storedWeight);
      status = "gedaan";
    }

    arr.push({
      habit: "gewicht",
      duration: null,  // geen duur relevant hier, maar kan ingevuld worden als voorbeeld
      date: dateStr,
      weight: gewicht,
      status: status,
    });
  }
  return arr;

}

function loadHabits() {
  habits = createHabitArray();
  sortHabits();
}

function sortHabits() {
  habits.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function renderHabitLog() {
  habitLogEl.innerHTML = '';

  habits.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'habit-item';
    li.innerHTML = `
      <div class="info">
        <span class="date">${item.date}</span>
        <span class="status">${item.weight !== null ? item.weight + ' kg' : 'Geen data'} (${item.status})</span>
      </div>
      <button>➤</button>
    `;
    li.addEventListener('click', () => openDetail(index));
  });
}

function openDetail(index) {
  selectedIndex = index;
  const item = habits[index];
  detailDateEl.textContent = `Habit for ${item.date}`;
  weightInput.value = item.weight !== null ? item.weight : '';
  weightStatus.textContent = item.status;
  homeScreen.style.display = 'none';
  detailScreen.style.display = 'flex';
  updateSummary(index);
}

function updateSummary(index) {
  const current = habits[index];
  const currentWeight = current.weight;
  let yesterdayDiff = '--';
  let weekDiff = '--';
  let avgPerDay = '--';

  if (index < habits.length - 1 && currentWeight !== null && habits[index + 1].weight !== null) {
    const diff = currentWeight - habits[index + 1].weight;
    yesterdayDiff = (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' kg';
  }

  const recentWeights = [];
  for (let i = index; i < index + 7 && i < habits.length; i++) {
    const w = habits[i].weight;
    if (typeof w === 'number' && w !== null) recentWeights.push(w);
  }

  if (recentWeights.length >= 2) {
    const change = recentWeights[0] - recentWeights[recentWeights.length - 1];
    const avg = change / (recentWeights.length - 1);
    weekDiff = (change >= 0 ? '+' : '') + change.toFixed(1) + ' kg';
    avgPerDay = (avg >= 0 ? '+' : '') + avg.toFixed(2) + ' kg/dag';
  }

  document.getElementById('diff-yesterday').textContent = yesterdayDiff;
  document.getElementById('diff-week').textContent = weekDiff;
  document.getElementById('avg-daily-change').textContent = avgPerDay;
}

saveWeightBtn.addEventListener('click', () => {
  const weight = parseFloat(weightInput.value);
  if (!isNaN(weight)) {
    const habit = habits[selectedIndex];
    habit.weight = weight;
    habit.status = "gedaan";
    weightStatus.textContent = "gedaan";
    localStorage.setItem(`weight-${habit.date}`, weight);
    renderHabitLog();
    updateSummary(selectedIndex);
  }
});

backBtn.addEventListener('click', () => {
  detailScreen.style.display = 'none';
  homeScreen.style.display = 'block';
});

loadHabits();
renderHabitLog();