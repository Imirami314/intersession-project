const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

const apiKey = 'AIzaSyC6anhq9BHUJPyoBZARXn3-Mq5PQeY4Qdg';

const fs = require('fs');

const addresses = JSON.parse(fs.readFileSync('addresses.json'));

async function computeRoute() {
  try {
    const response = await client.directions({
      params: {
        origin: addresses["Blubby Babagump"],
        destination: addresses["Gujrati Chapati"],
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
  } catch (error) {
    console.error('Error fetching directions:', error.response.data.error_message);
  }
}

computeRoute();