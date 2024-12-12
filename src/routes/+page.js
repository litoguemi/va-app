import Papa from 'papaparse';
import { base } from '$app/paths';
import { onMount } from "svelte";
import { MostVisitedCity } from '../js/statistics.js';
import { computeAgeGroup, 
         computeAccomodationGroup,
         computeGenderGroup,
        computeAvgSpendingPlace } from '../js/dataprocess.js';

export const ssr = false;

export async function load({ fetch, params }) {

  const travelCSV = await fetch(base + '/data/travel_dataset_updated.csv', {headers: {'Content-Type': 'text/csv'}})
  let travelTextCSV = await travelCSV.text()
  let parsedTravelCSV = Papa.parse(travelTextCSV, {header: true})

  const weatherCSV = await fetch(base + '/data/weather_data.csv', {headers: {'Content-Type': 'text/csv'}})
  let weatherTextCSV = await weatherCSV.text()
  let parsedWeatherCSV = Papa.parse(weatherTextCSV, {header: true})

  //Format data
  const travelFormat = parsedTravelCSV.data.map(d => ({
      ...d,
      AccommodationCost: parseFloat(d['Accommodation cost']),        // Convert to number
      TransportationCost: parseFloat(d['Transportation cost'])   // Convert to number
  }));

  const weatherFormat = parsedWeatherCSV.data.map(d => ({
      ...d,      
      StartDate: (() => {
        if (d['Start date']) {
          const dateParts = d['Start date'].split('/');
          return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        }
        return null;
      })()    
  }));

  
  let travels = travelFormat;
  let weather = weatherFormat;

  //Compute statistics
  const resultMostLeast = await new MostVisitedCity().compute(travels); 
  
  //Compute PieCharts
  const groupedAge = await computeAgeGroup(travels);
  const groupedAccomodation = await computeAccomodationGroup(travels);
  const groupedGender = await computeGenderGroup(travels);

  //Compute Barcharts
  const avgSpendingPlace = await computeAvgSpendingPlace(travels);


  console.log('Computed:'+resultMostLeast.mostVisited+' - '+resultMostLeast.maxVisits+' - '+resultMostLeast.leastVisited+ ' - '+ resultMostLeast.minVisits);


  return {
    trips:              travelFormat,
    weather:            weatherFormat,
    stMostLeastVisited: resultMostLeast,
    groupedAge:         groupedAge,
    groupedAccomodation: groupedAccomodation,
    groupedGender:      groupedGender,
    avgSpendingPlace:   avgSpendingPlace
  }

};



