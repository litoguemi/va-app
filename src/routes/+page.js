import Papa from 'papaparse';
import { base } from '$app/paths';

export async function load ({ fetch }){
  
  const responseCSV = await fetch(base + '/data/flights.csv', {headers: {'Content-Type': 'text/csv'}})
  let textCSV = await responseCSV.text()
  let parsedCSV = Papa.parse(textCSV, {header: true})

  return { 
    flights: parsedCSV.data 
  }
}