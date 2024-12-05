import Papa from 'papaparse';
import { base } from '$app/paths';
export const ssr = false;

export async function load ({ fetch }){
  
  const flightsCSV = await fetch(base + '/data/flights.csv', {headers: {'Content-Type': 'text/csv'}})
  let flightsTextCSV = await flightsCSV.text()
  let parsedFlightsCSV = Papa.parse(flightsTextCSV, {header: true})

  const usersCSV = await fetch(base + '/data/users.csv', {headers: {'Content-Type': 'text/csv'}})
  let usersTextCSV = await usersCSV.text()
  let parsedUsersCSV = Papa.parse(usersTextCSV, {header: true})

  const hotelsCSV = await fetch(base + '/data/hotels.csv', {headers: {'Content-Type': 'text/csv'}})
  let hotelsTextCSV = await hotelsCSV.text()
  let parsedHotelsCSV = Papa.parse(hotelsTextCSV, {header: true})


  //Format data
  const flightsFormat = parsedFlightsCSV.data.map(d => ({
      ...d,
      price: parseFloat(d.price),        // Convert to number
      distance: parseFloat(d.distance),   // Convert to number
  }));

  const hotelsFormat = parsedHotelsCSV.data.map(d => ({
    ...d,
    total: parseFloat(d.total),        // Convert to number
  }));
  


  //Data conversion
  let avgSpentPlace = await averageSpendingDays(hotelsFormat); 

  
  return { 
    flights: flightsFormat,
    users: parsedUsersCSV.data,
    hotels: parsedHotelsCSV.data,
    avgSpendingPlaces :  avgSpentPlace
  }
}


async function averageSpendingDays(data) {
  let spendingByPlace = {};

  data.forEach((entry) => {
      const place = entry.place;
      if (!spendingByPlace[place]) {
          spendingByPlace[place] = 0;
      }
      spendingByPlace[place] += entry.total;
  });

  // Convert the spendingByPlace object into an array for easier charting
  let chartData = Object.keys(spendingByPlace).map(place => ({
      place,
      total: spendingByPlace[place]
  }));

  return chartData;
}