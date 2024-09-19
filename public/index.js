const addresses = (await fetch('/addresses')).json();
// const apiKey = (await fetch('/apiKey')).json();

// console.log((await addresses)["Wilson"]);

// const route = {
//   start: 'Wilson',
//   end: "Esti Dee",
// };

const startName = "Wilson";
const endName = "School";

const stopNames = [
  "Polly Paul",
  "Jamal 18 in.",
  "Kevin Cosby",
  "Carlos Desposito"
];

const stopAddresses = await Promise.all(stopNames.map(async (name) => (await addresses)[name]));

function getStopsUrlString() {
  let result = "";
  stopAddresses.forEach((address, index) => {
    if (index == 0) {
      result += address;
    } else {
      result += "|" + address;
    }
  });

  return result;
}


const route = {
  origin: (await addresses)[startName],
  destination: (await addresses)[endName]
}

const urlRoute = new URLSearchParams(route);

document.getElementById("map-embed").src = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyC6anhq9BHUJPyoBZARXn3-Mq5PQeY4Qdg&${urlRoute}&waypoints=${getStopsUrlString()}`;

// const response = await fetch('/computeRoute?' + urlRoute.toString());