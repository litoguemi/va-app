import Papa from 'papaparse'


export const load = async ({ fetch }) => {
    const responseFlights = await fetch('https://jan-to.github.io/WebDataVis/flights_part.csv', 
      { headers: { 'Content-Type': 'text/csv' } })
    let csvFlights = await responseFlights.text()
    let parsedCsvFlights = Papa.parse(csvFlights, {header: true})

    return { flights: parsedCsvFlights.data }
}