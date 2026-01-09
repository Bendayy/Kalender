function updateDateTime() {
  const now = new Date();
  document.getElementById('today-date').textContent =
    now.toLocaleDateString('sv-SE', { weekday:'long', day:'numeric', month:'long' });
  document.getElementById('current-time').textContent =
    now.toLocaleTimeString('sv-SE', { hour:'2-digit', minute:'2-digit' });

  const d = new Date(now);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(),0,4);
  const week = 1 + Math.round(((d - week1)/86400000 - 3 + (week1.getDay()+6)%7)/7);
  document.getElementById('week-number').textContent = `Vecka ${week}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

fetch('https://api.open-meteo.com/v1/forecast?latitude=59.33&longitude=18.07&current_weather=true')
  .then(r => r.json())
  .then(d => {
    document.getElementById('temp').textContent =
      Math.round(d.current_weather.temperature) + '°';
    document.getElementById('weather-status').textContent = 'Nuvarande väder';
  });

document.querySelectorAll('.menu a').forEach(link => {
  link.onclick = e => {
    e.preventDefault();
    document.querySelectorAll('.menu a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    document.getElementById(link.dataset.view + '-view').classList.add('active-view');
  };
});

const grid = document.getElementById('calendarGrid');
const events = JSON.parse(localStorage.getItem('events') || '{}');

for (let h = 9; h <= 15; h++) {
  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = `${h}:00`;
  grid.appendChild(time);

  for (let d = 0; d < 6; d++) {
    const cell = document.createElement('div');
    cell.className = 'cell event-cell';
    const id = `${h}-${d}`;
    cell.dataset.id = id;

    if (events[id]) {
      const ev = document.createElement('div');
      ev.className = 'event';
      ev.textContent = events[id];
      cell.appendChild(ev);
    }

    cell.onclick = () => {
      const title = prompt('Eventtitel:');
      if (!title) return;

      events[id] = title;
      localStorage.setItem('events', JSON.stringify(events));
      location.reload();
    };

    grid.appendChild(cell);
  }
}

const notesArea = document.getElementById('notesArea');
notesArea.value = localStorage.getItem('notes') || '';

document.getElementById('saveNotes').onclick = () => {
  localStorage.setItem('notes', notesArea.value);
  alert('Anteckningar sparade!');
};