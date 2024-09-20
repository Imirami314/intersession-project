// import { findPlaceFromText } from "@googlemaps/google-maps-services-js/dist/places/findplacefromtext";

const addresses = (await (await fetch('/addresses')).json());


// const apiKey = (await fetch('/apiKey')).json();

const startName = "Esti Dee";
const endName = "School";

const bestCarpool = (await (await fetch(`/getBestCarpool?start=${startName}&end=${endName}`)).json()).name;

console.log(bestCarpool);

const route = {
  origin: (addresses)[startName],
  destination: (addresses)[endName]
}

const urlRoute = new URLSearchParams(route); // will return "origin=[origin]&destination=[destination]" and replaces spaces with %20s

const stopNames = [
  bestCarpool
];

const stopAddresses = await Promise.all(stopNames.map(async (name) => (await addresses)[name]));

async function getStopsUrlString() {
  let result = "";

  for (let index = 0; index < stopAddresses.length; index++) {
    const address = await stopAddresses[index];
    if (index === 0) {
      result += address;
    } else {
      result += "|" + address;
    }
  }

  return result;
}

// Example usage
const stopsUrlString = await getStopsUrlString();

const mapEmbedLink = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyC6anhq9BHUJPyoBZARXn3-Mq5PQeY4Qdg&${urlRoute}&waypoints=${stopsUrlString}`;
console.log(mapEmbedLink)
document.getElementById("map-embed").src = mapEmbedLink;