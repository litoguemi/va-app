
<script>
    import { base } from '$app/paths';
    import { onMount} from "svelte";
    import L from "leaflet";
    import { computeMostFrequentWeather } from '../js/dataprocess.js';
    
    let map;
    let { datapoints = [], month='month'} = $props();
    

    onMount(async () => {
      map = L.map("map", { preferCanvas: true }).setView(
        [20, 0],
        2,
      );
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
          maxZoom: 18,
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
        const mostFrequentData = computeMostFrequentWeather(datapoints, month);

        console.log('computedMostWeather'+month+' data:'+mostFrequentData.length);
        

        mostFrequentData.forEach(location => {
          const icon = L.icon({
            iconUrl: `${base}/data/${location.icon_location}`,
            iconSize: [50, 50],
            iconAnchor: [25, 25],
            popupAnchor: [0, -25]
          });
          if(location.lat && location.lat){
            const marker = L.marker([location.lat, location.lon], { icon }).addTo(map);
            marker.bindPopup(`<b>${location.Destination}</b><br>${location.condition_text}`);
          }
        });
      }


  </script>
  
  <svelte:head>
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
      crossorigin=""
    />
  
    <script
      src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
      crossorigin=""
    >
    </script>
  </svelte:head>
  
  <div id="map"></div>
  
  <style>
    #map {
        height: 400px;
    }
  </style>