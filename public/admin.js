const socket = io();
const timersDiv = document.getElementById('timers');
const staticDiv = document.getElementById('static-values');

// Render timers for admin controls
function renderTimers(timers) {
    timersDiv.innerHTML = '';
    timers.forEach(timer => {
        const timerDiv = document.createElement('div');
        timerDiv.className = 'timer';
        timerDiv.innerHTML = `
            <h3>${timer.name}</h3>            
            <button onclick="startTimer('${timer.name}')">Start</button>
            <button onclick="pauseTimer('${timer.name}')">Pause</button>
            <button onclick="resetTimer('${timer.name}')">Reset</button>
        `;
        timersDiv.appendChild(timerDiv);
    });
}

// Render static value inputs for admin
function renderStatic(staticData) {
    staticDiv.innerHTML = '';
    staticData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'static';
        itemDiv.innerHTML = `
            <label>${item.name}:</label>
            <input type="number" value="${item.value}" onchange="updateStatic('${item.name}', this.value)">
        `;
        staticDiv.appendChild(itemDiv);
    });
}

// Fetch and render data
fetch('/data')
    .then(response => response.json())
    .then(data => {
        renderTimers(data.timers);
        renderStatic(data.static);
    });

// Timer control functions
function startTimer(timerName) {
    socket.emit('start-timer', timerName);
}

function pauseTimer(timerName) {
    socket.emit('pause-timer', timerName);
}

function resetTimer(timerName) {
    socket.emit('reset-timer', timerName);
}

// Update static value
function updateStatic(name, value) {
    fetch('/update-static', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, value: Number(value) }),
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              console.log(`Updated ${name} to ${value}`);
          } else {
              console.error(`Failed to update ${name}: ${data.message}`);
          }
      });
}
