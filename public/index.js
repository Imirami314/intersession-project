// import { findPlaceFromText } from "@googlemaps/google-maps-services-js/dist/places/findplacefromtext";

const addresses = (await (await fetch('/addresses')).json());


// const apiKey = (await fetch('/apiKey')).json();

const startName = "Esti Dee";
const endName = "School";



const bestCarpool = (await (await fetch(`/getBestCarpool?start=${startName}&end=${endName}`)).json());

const stopNames = [
    bestCarpool.name
];

const urlDist = new URLSearchParams({
    start: startName,
    stop: stopNames[0],
    end: endName,
    route: JSON.stringify(bestCarpool)
})

console.log(urlDist)

const CAR_EMISSIONS = 411; // average grams of CO2 per mile

const distanceSaved = (await (await fetch(`/getDistanceSaved?${urlDist}`)).json()).distanceSaved;
const emmisionsSaved = distanceSaved * CAR_EMISSIONS;

console.log(bestCarpool);
console.log("you saved " + distanceSaved)
document.getElementById("emissionsSaved").textContent = "You saved " + emmisionsSaved + "g of CO2!"

const route = {
  origin: (addresses)[startName],
  destination: (addresses)[endName]
}

const urlRoute = new URLSearchParams(route); // will return "origin=[origin]&destination=[destination]" and replaces spaces with %20s



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