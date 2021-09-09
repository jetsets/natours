/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamV0c2V0c3JhZGlvIiwiYSI6ImNrcDRvMjgydDFwY2Iyb213aDZhaDVqc24ifQ.swEoGB9npzyFgs4YuwA6NQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jetsetsradio/ckp4orlv82k3q17mpbc1hbaqd',
    scrollZoom: false,
    //   center: [-73.960536, 40.673056],
    //   zoom: 6,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';
    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //add popup
    new mapboxgl.Popup({
      offset: 30,
      focusAfterOpen: false,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    //extends mapbounds to include location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
