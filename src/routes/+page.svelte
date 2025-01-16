<script>

    import '../css/style.css';
    import { onMount } from 'svelte';

    import Barchart from '../components/Barchart.svelte'; 
    import Piechart from '../components/Piechart.svelte'; 
    import Map from '../components/Map.svelte';
    import Statistics from '../components/Statistics.svelte';
    import Linechart from '../components/Linechart.svelte';
    import { computeAgeGroup, 
            computeAccomodationGroup,
            computeGenderGroup,
            computeTransportationGroup,
            computeAvgSpendingPlace,
            computeAvgSpendingPlaceMonth } from '../js/dataprocess.js';

    import { base } from '$app/paths';

    let { data } = $props();
    let selectedMonth = $state(new Date().getMonth() + 1);  // Current month number (1-12)    
    let selectedDestination = $state('New York, USA');  // Current month number (1-12)    

    let groupedAge = $state(data.groupedAge); 
    let groupedAccomodation = $state(data.groupedAccomodation); 
    let groupedGender = $state(data.groupedGender);  
    let groupedTransportation = $state(data.groupedTransportation); 
    let avgSpendingPlace = $state(data.avgSpendingPlace);
    let avgSpendingPlaceMonth = $state([]);    
    
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    
    async function updateData() {
        groupedAge = await computeAgeGroup(data.trips, selectedMonth);
        groupedAccomodation = await computeAccomodationGroup(data.trips, selectedMonth);
        groupedGender = await computeGenderGroup(data.trips, selectedMonth);
        groupedTransportation = await computeTransportationGroup(data.trips, selectedMonth);
        avgSpendingPlace = await computeAvgSpendingPlace(data.trips, selectedMonth);
        avgSpendingPlaceMonth = await computeAvgSpendingPlaceMonth(data.trips, selectedDestination);
    }
    
    $effect(() => { updateData(); });

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
        <div class="item item-main">
            <div class="item-controls">                
                <div class="checkbox-list">
                    <select id="monthSelect" bind:value={selectedMonth}>
                        {#each months as month, index}
                          <option value={index + 1}>{month}</option>
                        {/each}
                    </select>                
                </div>            
            </div>
            <Map datapoints={data.weather} month={selectedMonth}/>
            <div class="pies-container">
                <Piechart groupedData={groupedAge} title="Age Distribution"/>
                <Piechart groupedData={groupedGender} title="Gender Distribution"/>
                <Piechart groupedData={groupedAccomodation} title="Accomodation Distribution"/>                
                <Piechart groupedData={groupedTransportation} title="Transportation Distribution"/>                            
            </div>
        </div>
        <div class="item item-tendency">
            <h3>Expenses Tendency</h3>
            <Barchart datapoints={avgSpendingPlace} x="cityName" y="total" 
                      xLabel="Visited Places" yLabel="Average Spendings (Dolar)"
                      tooltipData={['accommodation','transportation']}
                      tooltipLabel={['Accomodation:','Transportation:']}/>
            <Linechart datapoints={avgSpendingPlaceMonth} x="month" y="total" xLabel="Montly Expenses for {selectedDestination}" yLabel=""/>                                
        </div>        
    </div>
</main>

<style>
    .checkbox-list { 
        display: flex;         
        flex-direction: row; 
        gap: 0.5rem; 
        margin-top: 1rem; 
        align-items: start;
    } 

    .checkbox-list select {
        padding: 0.5rem;
        font-size: 1rem;
        border-radius: 8px;
        border: 2px solid rgba(0,0,0,0.2);
        background-color: #f9f9f9;
        color: #2c3e50;
        box-shadow: 0 4px 8px rgba(1, 5, 14, 0.1);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        cursor: pointer;
    }
    .checkbox-list select:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
    }

    .checkbox-list select:hover { 
        background-color: #eaeaea;         
    }

    .statistics-container { 
        display: flex; 
        flex-direction: row; 
        gap: 1rem; 
        justify-content: center;
        }

    .pies-container { 
        flex-direction: row; 
        gap: 1rem; 
        margin-top: 1rem; 
        justify-content: space-evenly;
        overflow-x: auto;
        white-space: nowrap;
        }    
</style>
