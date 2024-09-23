import dotenv from 'dotenv';
import { Client } from '@googlemaps/google-maps-services-js';
import { readFileSync } from 'fs';
import { bearing } from './public/angles.js';

dotenv.config();

const client = new Client({});

const apiKey = process.env.API_KEY;

export const addresses = JSON.parse(readFileSync('addresses.json'));

/**
 * Computes data :))))
 * @param {*} start This can either be an address string or the name of the person at that address (in addresses.json)
 * @param {*} end This can either be an address string or the name of the person at that address (in addresses.json)
 */
export async function computeRoute(start, end) {
  try {
    const response = await client.directions({
      params: {
        origin: addresses[start] ?? start,
        destination: addresses[end] ?? end,
        mode: 'driving', // options are 'driving, 'walking', 'bicycling', 'transit'
        key: apiKey,
      },
      timeout: 1000, // milliseconds
    });

    // handle route information
    const route = response.data.routes[0];
    const distance = route.legs[0].distance.text;
    const duration = route.legs[0].duration.text;
    // console.log(`From ${start} to ${end}`)
    // console.log(`Distance: ${distance}`);
    // console.log(`Duration: ${duration}`);
    
    return {
        distance: distance,
        duration: duration
    }
  } catch (error) {
    console.error('Error fetching directions:', error);
  }
}

export async function computeRouteWithStops(locations) {
  let total = {
    distance: 0,
    duration: 0
  };

  const routePromises = [];

  // Generate promises for each route segment
  for (let i = 0; i < locations.length - 1; i++) {
    routePromises.push(computeRoute(locations[i], locations[i + 1]));
  }

  // Wait for all route segments to be computed in parallel
  const routeSegments = await Promise.all(routePromises);

  // Sum up distance and time
  for (const segment of routeSegments) {
    total.distance += parseFloat(await segment.distance);
    total.duration += parseFloat(await segment.duration);
  }

  return total;
}

export async function computeRoutesToSchool(locations) {
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

export async function getBestCarpool(start, end) {
  let fastestDuration = 140837;
  let fastestName = "g";
  let fastestDist = 140838;


  for (const name in addresses) {
    if (!start.includes(addresses[name] ?? name) && !end.includes(addresses["name"] ?? name)) { // .includes is necessary because the start and end addresses have, USA at the end while the ones inputted do not
      let curRoute = await computeRouteWithStops([
        start,
        name,
        end
      ]);

      console.log(`Carpooling ${addresses[name]}: ${(await curRoute).duration} (Going from ${start} to ${end})`);
      console.log(`Does [${start}] include [${addresses[name]}]? ${start.includes(addresses[name])}`)

      if ((await curRoute).duration < fastestDuration) {
        fastestDuration = (await curRoute).duration;
        fastestDist = (await curRoute).distance;
        fastestName = name;
      }
    }
  }

  console.log(`${fastestName} is the best carpool`)
  

  return {
    name: fastestName,
    distance: fastestDist,
    duration: fastestDuration
  };
}

export async function toCoords(address) {
  const response = await client.geocode({
    params: {
      address: address,
      key: apiKey,
    },
  })
  .then(response => {
    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      console.log(location);
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

  return response;
}

export async function getDistanceSaved(start, stop, end, route) {
    let carpoolDist = route.distance

    // calculation: start to end + stop to end - route
    let startToEnd = parseFloat((await computeRoute(addresses[start] ?? start, addresses[end] ?? end)).distance)
    let stopToEnd = parseFloat((await computeRoute(addresses[stop] ?? stop, addresses[end] ?? end)).distance)

    return Math.round((startToEnd + stopToEnd - carpoolDist));
}