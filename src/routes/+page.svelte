<script>
    import Scatterplot from '../components/Scatterplot.svelte'; 
    import Barchart from '../components/Barchart.svelte'; 
    import { base } from '$app/paths';

    let { data } = $props();
    
</script>

<Scatterplot datapoints={data.flights} x="price" y="distance" xLabel="Price (Euros)" yLabel="Distance (Km)"/>
<Barchart datapoints={data.avgSpendingPlaces} x="place" y="total" xLabel="Visited Places" yLabel="Average Spendings (Euros)"/>
