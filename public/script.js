const socket = io(); // Connect to the WebSocket server
const timersDiv = document.getElementById("timers"); // Div to display timers
const staticDiv = document.getElementById("staticData"); // Div to display static values

// Render timers
function renderTimers(timers) {
    timersDiv.innerHTML = ""; // Clear the previous content

    // Create a container for the grid
    const gridContainer = document.createElement("div");
    gridContainer.className = "space-y-24 tracking-widest";

    // First two rows with 3 timers each
    const firstTwoRows = document.createElement("div");
    firstTwoRows.className = "grid md:grid-cols-2 xl:grid-cols-3 text-right gap-3 gap-y-5";

    for (let i = 0; i < 6; i++) {
      const timer = timers[i];
      const timerDiv = document.createElement("div");
      timerDiv.className = "flex flex-col items-end justify-between";

      timerDiv.innerHTML = `
            <h3 class="text-xs max-w-xs">${timer.name}</h3>
            <p class="text-primary text-5xl font-extrabold">
                ${String(timer.value).padStart(11, "0")}
            </p>
        `;

      firstTwoRows.appendChild(timerDiv);
    }

    gridContainer.appendChild(firstTwoRows);

    // Last two rows with 2 centered timers each
    const lastTwoRows = document.createElement("div");
    lastTwoRows.className = "grid md:grid-cols-2 xl:grid-cols-6 text-right gap-3 gap-y-5";

    for (let i = 6; i < timers.length; i++) {
      const timer = timers[i];
      const timerDiv = document.createElement("div");
      timerDiv.className = "xl:col-span-2 flex flex-col justify-between items-end";

      if (i % 2 === 0) {
        timerDiv.className += " xl:col-start-2";
      }

      timerDiv.innerHTML = `
            <h3 class="text-xs max-w-xs">${timer.name}</h3>
            <p class="text-primary text-5xl font-extrabold">
                ${String(timer.value).padStart(11, "0")}
            </p>
        `;

      lastTwoRows.appendChild(timerDiv);
    }

    gridContainer.appendChild(lastTwoRows);

    timersDiv.appendChild(gridContainer);
}

// Render static values
function renderStatic(staticData) {
    const gridContainer = document.createElement('div');
    gridContainer.className = "grid md:grid-cols-2 xl:grid-cols-4 text-right gap-3 gap-y-5";

    staticData.forEach(staticItem => {
        const itemContainer = document.createElement('div');
        itemContainer.className = "flex flex-col gap-3 items-end justify-between";

        itemContainer.innerHTML = `
            <h3 class="text-xs max-w-xs">${staticItem.name}</h3>
            <p class="text-primary text-4xl font-extrabold">
                ${String(staticItem.value).padStart(11, '0')}
            </p>
        `;
        gridContainer.appendChild(itemContainer);
    });

    staticDiv.appendChild(gridContainer);
}

// Fetch and render all data
fetch('/data')
    .then(response => response.json())
    .then(data => {
        renderTimers(data.timers);
        renderStatic(data.static);
    });

// Timer control functions
// function startTimer(timerName) {
    // socket.emit('start-timer', timerName);
// }

// function pauseTimer(timerName) {
    // socket.emit('pause-timer', timerName);
// }

// function resetTimer(timerName) {
    // socket.emit('reset-timer', timerName);
// }

// Update timers in real-time via WebSocket
socket.on('update-timers', (timers) => {
    renderTimers(timers);
});
