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
            computeAvgSpendingPlaceMonth,
            computeAvgWeatherPlaceMonth } from '../js/dataprocess.js';

    import { base } from '$app/paths';

    let { data } = $props();
    let selectedMonth = $state(new Date().getMonth() + 1);  // Current month number (1-12)    
    let selectedDestination = $state(null); 

    let groupedAge = $state(data.groupedAge); 
    let groupedAccomodation = $state(data.groupedAccomodation); 
    let groupedGender = $state(data.groupedGender);  
    let groupedTransportation = $state(data.groupedTransportation); 
    let avgSpendingPlace = $state([]);
    let avgSpendingPlaceMonth = $state([]);    
    let avgWeatherPlaceMonth = $state([]);
    
    let mapRef;

    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    const refreshIconUrl = `${base}/data/icons/refresh_24.png`;

    async function updateData() {
        groupedAge = await computeAgeGroup(data.trips, selectedMonth);
        groupedAccomodation = await computeAccomodationGroup(data.trips, selectedMonth);
        groupedGender = await computeGenderGroup(data.trips, selectedMonth);
        groupedTransportation = await computeTransportationGroup(data.trips, selectedMonth);
        avgSpendingPlace = await computeAvgSpendingPlace(data.trips, selectedMonth);
        selectedDestination = null;
        avgSpendingPlaceMonth = await computeAvgSpendingPlaceMonth(data.trips, selectedDestination);
        avgWeatherPlaceMonth = await computeAvgWeatherPlaceMonth(data.weather, selectedDestination);
        const bars = document.querySelectorAll('rect');
        bars.forEach(bar => bar.classList.remove('selected'));
        await zoomToSpecificLocation(null);
    }

    async function updateLineChart(destination) { 
        selectedDestination = destination; 
        console.log('selectedDestination:'+selectedDestination);        
        avgSpendingPlaceMonth = await computeAvgSpendingPlaceMonth(data.trips, selectedDestination); 
        avgWeatherPlaceMonth = await computeAvgWeatherPlaceMonth(data.weather, selectedDestination);
    }

    async function updateSelectedPlace() { 
        selectedDestination = null;
        avgSpendingPlaceMonth = await computeAvgSpendingPlaceMonth(data.trips, selectedDestination);
        avgWeatherPlaceMonth = await computeAvgWeatherPlaceMonth(data.weather, selectedDestination);
        const bars = document.querySelectorAll('rect');
        bars.forEach(bar => bar.classList.remove('selected'));
        await zoomToSpecificLocation(null);
    }

    async function zoomToSpecificLocation(datapoint) {    
        if (mapRef && mapRef.zoomToPoint) {
            if(datapoint){
                await mapRef.zoomToPoint(datapoint.place);                        
            }else{
                await mapRef.zoomToPoint('Global');
            }
        }
    }

    $effect(() => { updateData();});

</script>



<main>    
    <div class="container">
        <div class="item title" style="grid-column: span 2;">
            <h1>Travel Research</h1>            
        </div>
        <div class="item item-summary">
            <h3 style="margin-bottom: inherit;">Global Summary of Trips</h3> 
            <hr style="border: none; border-top: 3px solid #e0e0e0;width: 100%;">
            <div class="statistics-container"> 
                <Statistics number={data.stMostLeastVisited.maxVisits} measure={'trips'} description={'Most Visited'} place={data.stMostLeastVisited.mostVisited}/>
                <Statistics number={data.stMostLeastVisited.minVisits} measure={'trips'} description={'Least Visited'} place={data.stMostLeastVisited.leastVisited} /> 
                <Statistics number={data.stWeatherExtremes.mostRainy.totalprecip_mm} measure={'mm'} description={'Most rainy'} place={data.stWeatherExtremes.mostRainy.destination}/>
                <Statistics number={data.stWeatherExtremes.mostSunny.avgvis_km} measure={'kms visibility'} description={'Most Sunny'} place={data.stWeatherExtremes.mostSunny.destination} />
                <Statistics number={data.stWeatherExtremes.hottest.maxtemp_c} measure={'°C'} description={'Hottest Place'} place = {data.stWeatherExtremes.hottest.destination} />                 
                <Statistics number={data.stWeatherExtremes.coldest.avgtemp_c} measure={'°C'} description={'Coldest Place'} place = {data.stWeatherExtremes.coldest.destination} />                 
            </div>            
        </div>
        <div class="item item-main">            
            <div class="map-container">
                <Map bind:this={mapRef}  datapoints={data.weather} month={selectedMonth}/>
            </div>
            <div class="pies-container">
                <h3>Global Distribution of Visitors on {months[selectedMonth - 1]}</h3>
                <Piechart groupedData={groupedAge} title="Age" palette="age"/>
                <Piechart groupedData={groupedGender} title="Gender" palette="gender"/>
                <Piechart groupedData={groupedAccomodation} title="Accomodation" palette= "accommodation"/>                
                <Piechart groupedData={groupedTransportation} title="Transportation" palette="transportation"/>                            
            </div>
        </div>
        <div class="item item-tendency">            
            <div class="item-controls">
                <div class="control-title">
                    <h3>Average expenses of Trips on</h3>
                </div>                
                <div class="checkbox-list">
                    <select id="monthSelect" bind:value={selectedMonth}>
                        {#each months as month, index}
                          <option value={index + 1}>{month}</option>
                        {/each}
                    </select>                
                </div>            
            </div>
            <Barchart datapoints={avgSpendingPlace} x="cityName" y={['accommodation','transportation']} 
                      xLabel="Click on bars to see the details for each Destination" yLabel=""
                      tooltipData={['accommodation','transportation']}
                      tooltipLabel={['Accomodation:','Transportation:']}
                      updateLineChart={updateLineChart}
                      zoomToSpecificLocation={zoomToSpecificLocation}
                      lineChartKey="place"
                      barcolor={['#5A9FC5', '#B0D6B7']}
                      legends={['Acommodation', 'Transportation']}/>  
            
            <h4 style="margin: 20px 5px -15px 28px; display: inline-flex;  align-items: center;">
                {selectedDestination ? `Annual values for ${selectedDestination}` : 'Annual values for All Destinations'}                                        
                <button class="icon-button" id="refreshButton" onclick="{updateSelectedPlace}"
                        style="background-image: url({refreshIconUrl});"
                        aria-label="Refresh">
                </button>
            </h4>
            
            
            <div class="linechart-container">
                <Linechart datapoints={avgSpendingPlaceMonth}
                    x="month" y={['total']} 
                    xLabel="Average Expenses"
                    yLabel=""
                    tooltiplabel={['$', 'K']}
                    linecolor={['#5A9FC5']}/>
                <Linechart datapoints={avgWeatherPlaceMonth}
                    x="month" y={['MaxTemp_Max', 'MinTemp_Min']} 
                    xLabel="Average Weather"
                    yLabel=""
                    tooltiplabel={['', '°C']}
                    linecolor={['#E52020','#7EC8E3']}
                    legends={['Max Temp', 'Min Temp']}
                    width="400"/>                                
            </div>                      
        </div>        
    </div>
</main>

<style>
    .checkbox-list {         
        margin-top: 10px;        
    } 

    .checkbox-list select {
        padding: 0.5rem;
        font-size: 17px;
        border-radius: 5px;                
        background-color: #f9f9f9;
        color: #2c3e50;
        border:none;
        box-shadow: 0 4px 8px rgba(1, 5, 14, 0.57);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        cursor: pointer;
    }
    .checkbox-list select:focus {
        outline: none;
        border-color: #0f6ec2;
        box-shadow: 0 4px 8px rgba(1, 5, 14, 0.57);
    }

    .checkbox-list select:hover { 
        background-color: #eaeaea;         
    }

    .icon-button {        
        width: 26px;
        height: 26px;
        background-size: cover;
        background-position: center;
        border: none;
        border-radius: 5px;                
        background-color: #f9f9f9;
        color: #2c3e50;
        box-shadow: 0 2px 2px rgba(1, 5, 14, 0.57);
        cursor: pointer;
        margin-left: 10px;
    }
    
    .icon-button:hover {
        background-color: #eaeaea;  /* Change background color on hover */
    }
    .icon-button:active {
        border-color: #0f6ec2;
        box-shadow: 0 2px 2px rgba(1, 5, 14, 0.57);
    }

    .control-title{
        grid-column: span 4;
        text-align: end;
    }

    .statistics-container { 
        display: flex; 
        flex-direction: row; 
        gap: 1rem; 
        justify-content: center;
        margin-top: 10px; 
        }

    .pies-container { 
        flex-direction: row; 
        gap: 1rem;  
        justify-content: space-evenly;
        overflow-x: auto;
        white-space: nowrap;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(1, 5, 14, 0.2);
        background-color: white;
        }  
    .map-container { 
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(1, 5, 14, 0.2);
        margin-bottom: 10px;
        }  
    .linechart-container { 
        display: flex;
        flex-direction: row; 
        gap: 1rem;  
        justify-content: space-evenly;
        overflow-x: auto;
        white-space: nowrap;
        margin-top: 10px;
        }  
</style>
