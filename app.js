// require('dotenv').config();

import dotenv from 'dotenv';

dotenv.config();

const CAR_EMISSIONS = 411; // average grams of CO2 per mile



import { Client } from '@googlemaps/google-maps-services-js';
const client = new Client({});

const apiKey = process.env.API_KEY;


import { readFileSync } from 'fs';

const addresses = JSON.parse(readFileSync('addresses.json'));


import { bearing } from './angles.js';

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

async function computeRoutesToSchool(locations) {
  try {
    // Prepare the list of locations for the Distance Matrix API
    const origins = locations.map(location => addresses[location] ?? location); // Origin points
    const destinations = [addresses["School"]];
    // const destinations = origins; // If you want to calculate between all locations

    // Make the request to the Distance Matrix API
    const response = await client.distancematrix({
      params: {
        origins: origins,
        destinations: destinations,
        mode: 'driving', // Can also be 'walking', 'bicycling', or 'transit'
        key: apiKey,
      },
      timeout: 1000, // milliseconds
    });

    // Extract distance and duration data from the response
    const rows = response.data.rows; // Rows contain the distance/duration data for each origin

    // Create a matrix of distances and durations
    const matrix = [];
    rows.forEach((row, rowIndex) => {
      const distancesRow = row.elements.map((element, colIndex) => {
        return {
          from: origins[rowIndex],
          to: destinations[colIndex],
          distance: element.distance.text,
          duration: element.duration.text
        };
      });
      matrix.push(distancesRow);
    });

    // Log the matrix or process it further as needed
    matrix.forEach(row => {
      row.forEach(item => {
        console.log(`From ${item.from} to ${item.to}: Distance = ${item.distance}, Duration = ${item.duration}`);
      });
    });

    return matrix; // Return the distance/duration matrix

  } catch (error) {
    console.error('Error fetching distance matrix:', error.response?.data?.error_message || error.message);
  }
}

async function toCoords(address) {
  const response = await client.geocode({
    params: {
      address: address,
      key: apiKey,
    },
  })
  .then(response => {
    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return location;
    } else {
      console.error(`Error: ${response.data.status} - ${response.data.error_message}`);
      return null;
    }
  })
  .catch(error => {
    console.error(`An error occurred: ${error}`);
    return null;
  });
}

// console.log(bearing(2, 4, 34, 43));

toCoords("1151 Junipero Ave, Redwood City, CA").then(location => {
  // console.log(`${location.lat}, ${location.lng}`);
  console.log(location);
}).catch(error => {
  console.error(`An error occurred: ${error}`);
  return null;
});