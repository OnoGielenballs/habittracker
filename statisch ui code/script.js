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