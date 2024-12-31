const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const TIMER_FILE = './timers.json';
const PORT = 3000;

// Load data from timers.json or initialize
let data = {};
if (fs.existsSync(TIMER_FILE)) {
    data = JSON.parse(fs.readFileSync(TIMER_FILE));
} else {
    data = {
        timers: [
            // Timer configurations here...
        ],
        static: [
            // Static configurations here...
        ],
    };
    fs.writeFileSync(TIMER_FILE, JSON.stringify(data));
}

// Serve static files
app.use(express.static('public'));

// Serve both timers and static values
app.get('/data', (req, res) => {
    res.json(data);
});

// Handle static value updates from the admin page
app.post('/update-static', express.json(), (req, res) => {
    const { name, value } = req.body;
    const staticItem = data.static.find(item => item.name === name);
    if (staticItem) {
        staticItem.value = value;
        fs.writeFileSync(TIMER_FILE, JSON.stringify(data));
        res.status(200).json({ success: true, updated: staticItem });
    } else {
        res.status(404).json({ success: false, message: 'Static value not found' });
    }
});

// WebSocket for real-time updates
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('initial-data', data);

    // Handle timer controls
    socket.on('start-timer', (timerName) => {
        const timer = data.timers.find(t => t.name === timerName);
        if (timer) timer.running = true;
    });

    socket.on('pause-timer', (timerName) => {
        const timer = data.timers.find(t => t.name === timerName);
        if (timer) timer.running = false;
    });

    socket.on('reset-timer', (timerName) => {
        const timer = data.timers.find(t => t.name === timerName);
        if (timer) timer.value = 0;
    });

    // Update timers every second
    const interval = setInterval(() => {
        let changed = false;
        data.timers.forEach(timer => {
            if (timer.running) {
                timer.value += timer.increment;
                changed = true;
            }
        });

        if (changed) {
            io.emit('update-timers', data.timers);
            fs.writeFileSync(TIMER_FILE, JSON.stringify(data));
        }
    }, 1000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
