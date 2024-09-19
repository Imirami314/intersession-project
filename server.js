import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

import { computeRoute, addresses } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/addresses', async (req, res) => {
    const addressList = await addresses;
    res.send(addressList);
});

app.get('/computeRoute', async (req, res) => {
    const route = await computeRoute(req.query.start, req.query.end);
    res.send(route);
});

app.get('/apiKey', async (req, res) => {
    res.send(process.env.API_KEY);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});