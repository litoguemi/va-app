<script>

    import '../css/style.css';

    import Scatterplot from '../components/Scatterplot.svelte'; 
    import Barchart from '../components/Barchart.svelte'; 
    import Piechart from '../components/Piechart.svelte'; 

    import { base } from '$app/paths';

    let { data } = $props();
    
</script>

<Scatterplot datapoints={data.flights} x="price" y="distance" xLabel="Price (Dolar)" yLabel="Distance (Km)"/>
<Barchart datapoints={data.avgSpendingPlaces} x="place" y="total" xLabel="Visited Places" yLabel="Average Spendings (Dolar)"/>
<Piechart datapoints={data.users} title="Age Distribution of Travelers"/>