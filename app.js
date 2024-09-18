// require('dotenv').config();

import dotenv from 'dotenv';

dotenv.config();



import { Client } from '@googlemaps/google-maps-services-js';
const client = new Client({});

const apiKey = process.env.API_KEY;

console.log(`Your API key is ${apiKey}`);

import { readFileSync } from 'fs';

const addresses = JSON.parse(readFileSync('addresses.json'));

/**
 * Computes data papa
 * @param {*} start This can either be an address string or the name of the person at that address (in addresses.json)
 * @param {*} end This can either be an address string or the name of the person at that address (in addresses.json)
 */
async function computeRoute(start, end) {
  try {
    const response = await client.directions({
      params: {
        origin: addresses[start] ?? start,
        destination: addresses[end] ?? end,
        mode: 'driving', // You can use 'walking', 'bicycling', or 'transit'
        key: apiKey,
      },
      timeout: 1000, // milliseconds
    });

    // Extract route information from the response
    const route = response.data.routes[0];
    const distance = route.legs[0].distance.text;
    const duration = route.legs[0].duration.text;
    console.log(`Distance: ${distance}`);
    console.log(`Duration: ${duration}`);
    
    return {
        distance: distance,
        duration: duration
    }

    
  } catch (error) {
    console.error('Error fetching directions:', error.response.data.error_message);
  }
}

computeRoute("Gujrati Chapati", "Esti Dee");