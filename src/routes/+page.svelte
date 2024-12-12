<script>

    import '../css/style.css';

    import Scatterplot from '../components/Scatterplot.svelte'; 
    import Barchart from '../components/Barchart.svelte'; 
    import Piechart from '../components/Piechart.svelte'; 
    import Map from '../components/Map.svelte';
    import Statistics from '../components/Statistics.svelte';

    import { base } from '$app/paths';

    let { data } = $props();

    const mostVisitedPlace2 = "Londres"; const visitsToday2 = 5412; // Example number
    const mostVisitedPlace3 = "Barcelona"; const visitsToday3 = 3612; // Example number
    const mostVisitedPlace4 = "Guyana"; const visitsToday4 = 60; // Example number

    let selectedMonth = $state("January");  // Default month

    function handleMonthChange(event) { 
        selectedMonth = event.target.value; 
    }

</script>

<main>    
    <div class="container">
        <div class="item title" style="grid-column: span 2;">
            <h1>Travel Research</h1>            
        </div>
        <div class="item item-summary">
            <h3 class="item-tittle">Summary of Recent Updates</h3> 
            <div class="statistics-container"> 
                <Statistics number={data.stMostLeastVisited.maxVisits} description={'is the most visited place today in '} place={data.stMostLeastVisited.mostVisited} />
                <Statistics number={data.stMostLeastVisited.minVisits} description={'is the least visited place today in '} place={data.stMostLeastVisited.leastVisited} /> 
                <Statistics number={visitsToday2} description={`is the most rainy place today in ${mostVisitedPlace2}`} />
                <Statistics number={visitsToday3} description={`is the most sunny place today in ${mostVisitedPlace3}`} />
                <Statistics number={visitsToday4} description={`is the lowest visited place today in ${mostVisitedPlace4}`} />                 
            </div>            
        </div>
        <div class="item item-controls">
            <h3 class="item-tittle">Controls</h3>
            <div class="checkbox-list">
                <label><input type="checkbox" value="Weather"> Weather</label> 
                <label><input type="checkbox" value="Population"> Population</label>
                <label><input type="checkbox" value="Most visited"> Most visited </label>                
            </div>

            <h3 class="item-tittle">Months</h3>
            <div class="checkbox-list">
                <label for="monthSelect">Select Month:</label>
                <select id="monthSelect" onchange={handleMonthChange} bind:value={selectedMonth}>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
            </div>            
        </div>
        <div class="item item-main">
            <Map datapoints={data.weather} month={selectedMonth}/>
            <div class="pies-container">
                <Piechart groupedData={data.groupedAge} title="Age Distribution"/>
                <Piechart groupedData={data.groupedAccomodation} title="Accomodation Distribution"/>
                <Piechart groupedData={data.groupedGender} title="Gender Distribution"/>                            
            </div>
        </div>
        <div class="item item-tendency">
            <h3>Current Tendency in a Specific Place</h3>
            <Barchart datapoints={data.avgSpendingPlace} x="cityName" y="total" xLabel="Visited Places" yLabel="Average Spendings (Dolar)"/>
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

    .pies-container { 
        display: flex; 
        flex-direction: row; 
        gap: 1rem; 
        margin-top: 1rem; 
        justify-content: space-evenly;
        }    
</style>
