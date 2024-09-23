// async function loadAddresses() {  
//   const addresses = (await (await fetch('/addresses')).json());
// }

// loadAddresses();

// const userAddress = sessionStorage.getItem("address");
// const apiKey = (await fetch('/apiKey')).json();

async function calculateBestCarpoolRoute(start, end) {

  const addresses = (await (await fetch('/addresses')).json());

  const bestCarpool = (await (await fetch(`/getBestCarpool?start=${start}&end=${end}`)).json());

  const stopNames = [
      bestCarpool.name
  ];

  const urlDist = new URLSearchParams({
      start: start,
      stop: stopNames[0],
      end: end,
      route: JSON.stringify(bestCarpool)
  })

  console.log(urlDist)

  const CAR_EMISSIONS = 411; // average grams of CO2 per mile

  const distanceSaved = (await (await fetch(`/getDistanceSaved?${urlDist}`)).json()).distanceSaved;
  const emmisionsSaved = distanceSaved * CAR_EMISSIONS;

  console.log(bestCarpool);
  if (emmisionsSaved >= 0) {
    document.getElementById("emissionsSaved").textContent = "You saved " + emmisionsSaved + "g of CO2!"
    document.getElementById("carpool-name").textContent = "Your fastest carpool is with " + bestCarpool.name + ".";
  } else {
    // document.getElementById("emissionsSaved").textContent = "You saved " + emmisionsSaved + "g of CO2!"
    document.getElementById("carpool-name").textContent = "Your fastest carpool is with " + bestCarpool.name + ", however this carpool uses more CO2 than if both of you just drove directly to school.";
  }

  const route = {
    origin: (addresses)[start] ?? start,
    destination: (addresses)[end] ?? end
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
  document.getElementById("map-embed").style.display = "block";
  document.getElementById("map").style.display = "none";
  // document.getElementById("loading-text").style.display = "none";

}

// calculateBestCarpoolRoute(userAddress, "School");