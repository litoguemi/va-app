
<script>
    import { base } from '$app/paths';
    import { onMount } from "svelte";
    import L from "leaflet";
  
    let data = [];
    let map;
  
    onMount(async () => {
      const responseJSON = await fetch(base + "/flights_part.json")
      const flights = await responseJSON.json()
      data = flights.slice(0, 5000); // reduce size
  
      map = L.map("map", { preferCanvas: true }).setView(
        [50.8476, 4.3572],
        2,
      );
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
          maxZoom: 18,
        },
      ).addTo(map);
      data.forEach((d) => {
        L.circle(
          [+d.from_lat, +d.from_long],
          {
            stroke: false,
            color: "black",
            radius: 50000  // radius in meters
          },
        ).addTo(map);
      });
    });
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
  
  <div id="map" />
  
  <style>
    #map {
        height: 480px;
    }
  </style>