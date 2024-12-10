<script>

    import '../css/style.css';

    import Scatterplot from '../components/Scatterplot.svelte'; 
    import Barchart from '../components/Barchart.svelte'; 
    import Piechart from '../components/Piechart.svelte'; 
    import Map from '../components/Map.svelte';
    import Statistics from '../components/Statistics.svelte';

    import { base } from '$app/paths';

    let { data } = $props();
    

    const mostVisitedPlace = "Vienna"; const visitsToday = 12345; // Example number
    const mostVisitedPlace2 = "Londres"; const visitsToday2 = 5412; // Example number
    const mostVisitedPlace3 = "Barcelona"; const visitsToday3 = 3612; // Example number
    const mostVisitedPlace4 = "Guyana"; const visitsToday4 = 60; // Example number
</script>

<main>    
    <div class="container">
        <div class="item title" style="grid-column: span 2;">
            <h1>Travel Research</h1>            
        </div>
        <div class="item item-summary">
            <h3 class="item-tittle">Summary of Recent Updates</h3> 
            <div class="statistics-container"> 
                <Statistics number={visitsToday} description={`is the most visited place today in ${mostVisitedPlace}`} />
                <Statistics number={visitsToday2} description={`is the most rainy place today in ${mostVisitedPlace2}`} />
                <Statistics number={visitsToday3} description={`is the most sunny place today in ${mostVisitedPlace3}`} />
                <Statistics number={visitsToday4} description={`is the lowest visited place today in ${mostVisitedPlace4}`} /> 
                <Statistics number={visitsToday} description={`is the lowest visited place today in ${mostVisitedPlace}`} /> 
            </div>            
        </div>
        <div class="item item-controls">
            <h3 class="item-tittle">Controls</h3>
            <div class="checkbox-list">
                <label><input type="checkbox" value="Weather"> Weather</label> 
                <label><input type="checkbox" value="Population"> Population</label>
                <label><input type="checkbox" value="Most visited"> Most visited </label>                
            </div>
        </div>
        <div class="item item-main">
            <Map />
            <Piechart datapoints={data.users} title="Age Distribution of Travelers"/>
            <Piechart datapoints={data.users} title="Age Distribution of Travelers"/>
            <Piechart datapoints={data.users} title="Age Distribution of Travelers"/>
        </div>
        <div class="item item-tendency">
            <h3>Current Tendency in a Specific Place</h3>
            <Scatterplot datapoints={data.flights} x="price" y="distance" xLabel="Price (Dolar)" yLabel="Distance (Km)"/>
            <Barchart datapoints={data.avgSpendingPlaces} x="place" y="total" xLabel="Visited Places" yLabel="Average Spendings (Dolar)"/>
            
        </div>        
    </div>
</main>

<style>
    .checkbox-list { 
        display: flex;         
        flex-direction: column; 
        gap: 0.5rem; 
        margin-top: 1rem; 
        align-items: start;
    } 
    .checkbox-list label { display: block; }

    .statistics-container { 
        display: flex; 
        flex-direction: row; 
        gap: 1rem; 
        margin-top: 1rem; 
        justify-content: center;
        }
</style>
