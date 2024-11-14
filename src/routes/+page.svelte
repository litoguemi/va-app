<script>
    import Scatterplot from '../components/Scatterplot.svelte'; 
    import { base } from '$app/paths';

    let { data } = $props();
    
    const flights = data.flights.map(d => ({
        ...d,
        price: parseFloat(d.price),        // Convert to number
        distance: parseFloat(d.distance),   // Convert to number
    }));

</script>

<Scatterplot datapoints={flights} x="price" y="distance" xLabel="Price (Euros)" yLabel="Distance (Km)"/>
