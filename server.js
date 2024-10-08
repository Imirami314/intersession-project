import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

import { computeRoute, addresses, computeRouteWithStops, getBestCarpool, getDistanceSaved } from './app.js';


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

app.get('/computeRouteWithStops', async (req, res) => {
    const route = await computeRouteWithStops(req.query.locations);
    res.send(route);
});

app.get('/getBestCarpool', async (req, res) => {
    const bestCarpool = await getBestCarpool(req.query.start, req.query.end);
    res.send(bestCarpool);
});

app.get('/apiKey', async (req, res) => {
    res.send(process.env.API_KEY);
});

app.get('/getDistanceSaved', async (req, res) => {
    const distanceSaved = await getDistanceSaved(req.query.start, req.query.stop, req.query.end, JSON.parse(req.query.route));
    res.send({distanceSaved: distanceSaved});
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});