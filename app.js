const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

const apiKey = 'AIzaSyC6anhq9BHUJPyoBZARXn3-Mq5PQeY4Qdg';

const fs = require('fs');

const addresses = JSON.parse(fs.readFileSync('addresses.json'));

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


// computeRoute("Gujrati Chapati", "Esti Dee");

computeRoutes([
  "Gujrati Chapati",
  "Esti Dee",
  "Japanese Tsunami",
]);