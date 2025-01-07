<script>

    import '../css/style.css';

    import Barchart from '../components/Barchart.svelte'; 
    import Piechart from '../components/Piechart.svelte'; 
    import Map from '../components/Map.svelte';
    import Statistics from '../components/Statistics.svelte';

    import { base } from '$app/paths';

    let { data } = $props();

    let selectedMonth = $state(new Date().toLocaleString('default', { month: 'long' }));  // Default month

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
            <h3 class="item-tittle">Global Summary of Recent Updates</h3> 
            <div class="statistics-container"> 
                <Statistics number={data.stMostLeastVisited.maxVisits} description={'is the most visited place today in '} place={data.stMostLeastVisited.mostVisited} />
                <Statistics number={data.stMostLeastVisited.minVisits} description={'is the least visited place today in '} place={data.stMostLeastVisited.leastVisited} /> 
                <Statistics number={data.stWeatherExtremes.mostRainy.totalprecip_mm} measure={'mm'} description={'is the most rainy place today in '} place={data.stWeatherExtremes.mostRainy.destination}/>
                <Statistics number={data.stWeatherExtremes.mostSunny.avgvis_km} measure={'kms'} description={' of visibility is the most sunny place today in '} place={data.stWeatherExtremes.mostSunny.destination} />
                <Statistics number={data.stWeatherExtremes.hottest.maxtemp_c} measure={'°C'} description={'is the hottest visited place today in '} place = {data.stWeatherExtremes.hottest.destination} />                 
                <Statistics number={data.stWeatherExtremes.coldest.avgtemp_c} measure={'°C'} description={'is the coldest visited place today in '} place = {data.stWeatherExtremes.coldest.destination} />                 
            </div>            
        </div>
        <div class="item item-controls">
            <h3 class="item-tittle">Months</h3>
            <div class="checkbox-list">
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

    .checkbox-list select {
        padding: 0.5rem;
        font-size: 1rem;
        border-radius: 8px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        color: #2c3e50;
        box-shadow: 0 4px 8px rgba(1, 5, 14, 0.1);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        cursor: pointer;
        width: 100%;
    }
    .checkbox-list select:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
    }

    .statistics-container { 
        display: flex; 
        flex-direction: row; 
        gap: 1rem; 
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
