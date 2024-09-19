const addresses = await fetch('/addresses');

const route = {
  start: 'Wilson',
  end: "Esti Dee",
};

const urlRoute = new URLSearchParams(route);

const response = await fetch('/computeRoute?' + urlRoute.toString());

console.log(await response.json());