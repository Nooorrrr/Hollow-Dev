const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post('/log', (req, res) => {
    const event = req.body;
    const logEntry = `${new Date().toISOString()} - ${JSON.stringify(event)}\n`;
  
    fs.appendFile('events.log', logEntry, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send('Event logged successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
