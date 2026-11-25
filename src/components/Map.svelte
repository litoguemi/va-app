
<script>
    import { base } from '$app/paths';
    import { onMount} from "svelte";
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";
    import { computeMostFrequentWeather } from '../js/dataprocess.js';
    
        
    let { datapoints = [], month='month'} = $props();
    let map;
    let mostFrequentData = [];

    onMount(async () => {
      map = L.map("map", { preferCanvas: true }).setView(
        [20, 0],
        2,
      );
      L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 2
        },
      ).addTo(map);
      
      updateMarkers();

    });

    $effect(() => { updateMarkers(); });

    function updateMarkers() {
      // Clear existing markers
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Process data and add markers
      mostFrequentData = computeMostFrequentWeather(datapoints, month);


      mostFrequentData.forEach(location => {
        const icon = L.icon({
          iconUrl: `${base}/data/${location.icon_location}`,
          iconSize: [50, 50],
          iconAnchor: [25, 25],
          popupAnchor: [0, -25]
        });
        if (location.lat && location.lon) {
          const marker = L.marker([location.lat, location.lon], { icon }).addTo(map);
          marker.bindPopup(`<b>${location.Destination}</b><br>${location.condition_text}`);
        }
      });
    }

    export function zoomToPoint(selectedDestination, zoomLevel=5) {
      if (!map) return;
      const pointLocation = mostFrequentData.find(location => location.Destination === selectedDestination);
      if (pointLocation) {
        map.setView([pointLocation.lat, pointLocation.lon], zoomLevel);
      }else{
        map.setView([0, 0], 2);
      }
    }
  </script>
  
  <div id="map"></div>
  
  <style>
    #map {
        height: 438px;
    }
  </style>