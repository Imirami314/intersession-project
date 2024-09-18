import addresses from './app.js';

async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const map = new Map(document.getElementById("map"), {
      center: { lat: 37.4239163, lng: -122.0947209 },
      zoom: 14,
      mapId: "4504f8b37365c3d0",
    });

    const marker = new AdvancedMarkerElement({
      map,
      position: { lat: 37.4239163, lng: -122.0947209 },
    });

    // for (let name in addresses) {
    //   let coordinates;

    //   toCords(addresses[name]).then(location => {
    //     coordinates = location;
    //   }).catch(error => {
    //     console.error(`An error occurred: ${error}`);
    //     return null;
    //   });

    //   const marker = new AdvancedMarkerElement({
    //     map,
    //     position: { lat: coordinates.lat, lng: coordinates.lng },
    //   });
    // }
  }
  
  initMap();