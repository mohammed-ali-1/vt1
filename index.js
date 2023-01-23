async function performSearch(place) {
  const url = `http://160.85.253.59/nominatim/search?q=${place}&format=json&addressdetails=1`;
  try {
    const response = await fetch(url)
    const responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  } catch (fetchError) {
    alert('fetch failed. error in console');
    console.error(fetchError);
  }
}

const markers = []
const circles = []

async function searchButtonClicked(event) {
  event.preventDefault();
  const form = event.target;
  const place = form.search_input.value;
  const searchResult = await performSearch(place);
  updateNominatimSearchResult(searchResult);
}

function updateNominatimSearchResult(searchResult) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.replaceChildren();
  const resultsTable = document.createElement('table');
  for (const result of searchResult) {
    const row = resultsTable.insertRow(0);
    const cell = row.insertCell(0);
    const button = document.createElement('button');
    button.textContent = result.display_name;
    button.addEventListener('click', function handleClick(event) {
      event.preventDefault();
      showOnMap(result.lat, result.lon, result.display_name);
    })
    cell.append(button);
    console.log(result)
  }

  resultsDiv.append(resultsTable)
}

function showOnMap(x, y, displayName) {
  map.setView([x, y], 13);

  if (markers.find(marker => marker._latlng.lat == x && marker._latlng.lng == y)) {
    return
  }

  const marker = L.marker([x, y]).addTo(map);
  marker.bindPopup(displayName);
  markers.push(marker)
}

async function performReverseSearch(coordiantes) {
  const url = `http://160.85.253.59/nominatim/reverse?lat=${coordiantes[0]}&lon=${coordiantes[1]}&format=json`;
  try {
    const response = await fetch(url)
    const responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  } catch (fetchError) {
    alert('fetch failed. error in console');
    console.error(fetchError);
  }
}

// map.on('click', function (event) {
//   console.log(event.latlng);
//   performReverseSearch([event.latlng.lat, event.latlng.lng]);
// });

map.on('click', function () {
  map.contextmenu.isVisible && map.contextmenu.hide()
})

function clearAmenitiesLayers() {
  for (circle of circles) {
    map.removeLayer(circle)
  }
}

async function searchForAmenities(event) {
  event.preventDefault();
  const form = event.target;
  const amenity = form.search_amenities_input.value;
  const url = buildOverpassApiUrl(map, amenity)
  console.log(url);
  clearAmenitiesLayers();

  try {
    const response = await fetch(url)
    const responseJson = await response.json();
    console.log('overpass response: ', responseJson);

    const markersGroup = L.layerGroup();

    for (element of responseJson.elements) {
      console.log(element)

      const contextMenuItems = await loadContextMenuItems('sbb')//element.tags.operator);
      console.log('contextMenuItems', contextMenuItems)

      const marker = L.circleMarker([element.lat, element.lon], {
        contextmenu: true,
        contextmenuInheritItems: false,
        contextmenuItems: contextMenuItems
      })//.addTo(map);
      marker.bindPopup(element.tags.name + ', ' + element.tags.network + ', ' + element.tags.operator);

      markersGroup.addLayer(marker)
      circles.push(marker)
    }

    markersGroup.addTo(map)

  } catch (fetchError) {
    alert('fetch failed. error in console');
    console.error(fetchError);
  }
}
const SBB_URL = 'http://127.0.0.1:80/'

async function getOperatorUrl(operator) {
  const operatorUrlMap = {
    'sbb': SBB_URL
  }

  return operatorUrlMap[operator]
}

async function loadContextMenuItems(operator) {
  const url = await getOperatorUrl(operator)
}

function buildOverpassApiUrl(map, overpassQuery) {
  var bounds = map.getBounds().getSouth() + ',' + map.getBounds().getWest() + ',' + map.getBounds().getNorth() + ',' + map.getBounds().getEast();
  var nodeQuery = 'node[' + overpassQuery + '](' + bounds + ');';
  // var wayQuery = 'way[' + overpassQuery + '](' + bounds + ');';
  // var relationQuery = 'relation[' + overpassQuery + '](' + bounds + ');';
  var query = '?data=[out:json][timeout:15];(' + nodeQuery + ');out body geom;';
  var baseUrl = 'https://overpass-api.de/api/interpreter';
  var resultUrl = baseUrl + query;
  return resultUrl;
}

function showCoordinates(e) {
  console.log(e.latlng.toString());
}

// function for marker menu "Show charts" - NOT working
function showCharts(e) {
  console.log(e.getLatLng().toString());
}
