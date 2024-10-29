import Papa from 'papaparse';
import { base } from '$app/paths';

export const load = async ({ fetch }) => {
  const responseJSON = await fetch(base + '/flights_part.json')
  const dataJSON = await responseJSON.json()

  const responseCSV = await fetch(base + '/flights_part.csv', {headers: {'Content-Type': 'text/csv'}})
  let textCSV = await responseCSV.text()
  let parsedCSV = Papa.parse(textCSV, {header: true})

  return { 
    flightsJSON: dataJSON,
    flightsCSV: parsedCSV.data 
  }
}