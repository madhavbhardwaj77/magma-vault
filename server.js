// SERVER.JS - The Backend Brain
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware (Allows data to flow)
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serves your index.html

// --- "VAULT" DATABASE (In-Memory for simplicity) ---
// In a real hackathon, you can say this is "Volatile RAM Storage" fitting the Hot Cloud theme.
let survivorLog = [
    { name: "HACKER_ZERO", score: 15 },
    { name: "NEO", score: 12 },
    { name: "GHOST", score: 8 }
];

// ROUTE 1: GET LEADERBOARD (Fetch Data)
app.get('/api/leaderboard', (req, res) => {
    // Sort by highest score first
    survivorLog.sort((a, b) => b.score - a.score);
    // Send top 5
    res.json(survivorLog.slice(0, 5));
});

// ROUTE 2: SAVE SCORE (Receive Data)
app.post('/api/score', (req, res) => {
    const { name, score } = req.body;
    
    if(!name || score === undefined) {
        return res.status(400).json({ error: "Invalid Data" });
    }

    console.log(`[HOT CLOUD] Incoming Stream: ${name} - Score: ${score}`);
    
    survivorLog.push({ name, score });
    
    // Sort and keep top 10 only (The "Burn" Logic - weak scores are deleted)
    survivorLog.sort((a, b) => b.score - a.score);
    if (survivorLog.length > 10) survivorLog.pop();

    res.json({ success: true, rank: survivorLog.findIndex(p => p.name === name) + 1 });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🔥 Magma Vault System Online at http://localhost:${PORT}`);
});