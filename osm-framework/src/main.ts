import { Map, TileLayer, LatLng } from 'leaflet'
import { nominatimServerUrl, tileServerUrl } from './config'
import './styles.css'

async function load() {
  const appContainer = document.getElementById('app')

  const mainDiv = document.createElement('div')
  mainDiv.id = 'map'
  mainDiv.className = 'map'

  appContainer?.appendChild(mainDiv)

  const map = new Map('map')
  map.setView(new LatLng(47.500014759306445, 8.720184894777164), 13)
  const layer = new TileLayer(`${tileServerUrl}/{z}/{x}/{y}.png`, {
    maxZoom: 18,
    attribution: 'attribution test',
  })
  layer.addTo(map)
  const boundedBox = map.getBounds()
  console.log(boundedBox)

  await callNominatimWithBoundedBox()
}
async function callNominatimWithBoundedBox(boundedBox?: any) {
  const url = `${nominatimServerUrl}/search?q=amenity=pub&format=json&limit=10&viewbox=47.529,8.763,47.471,8.677&bounded=1`
  try {
    const response = await fetch(url)
    const responseJson = await response.json()
    console.log(responseJson)
    return responseJson
  } catch (fetchError) {
    alert('fetch failed. error in console')
    console.error(fetchError)
  }
}

load();
