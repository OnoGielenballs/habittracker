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