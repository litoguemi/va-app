/**
 * Compute groups by age
 */
async function computeAgeGroup(datapoints, month=null){   

    // Filter data by month
    const filteredData = datapoints.filter(data => new Date(data.StartDate).getMonth() + 1 === Number(month));

    const ageGroups = filteredData.reduce((acc, person) => {         
        const ageGroup = `${Math.floor(person['Traveler age'] / 10) * 10}s`;
        if(ageGroup != 'NaNs'){
            acc[ageGroup] = (acc[ageGroup] || 0) + 1; 
        } 
        
        return acc; 
    }, {});

    console.log('computedage:'+JSON.stringify(ageGroups));
    
    return ageGroups;
}

/**
 * Compute groups by accommodation type
 */
async function computeAccomodationGroup(datapoints, month=null) {

    // Filter data by month
    const filteredData = datapoints.filter(data => new Date(data.StartDate).getMonth() + 1 === Number(month));

    const accommodationGroups = filteredData.reduce((acc, person) => {
        const accommodationGroup = person['Accommodation type'];
        if (accommodationGroup) {
            acc[accommodationGroup] = (acc[accommodationGroup] || 0) + 1;
        }
        return acc;
    }, {});   

    const sortedAccommodationGroups = Object.entries(accommodationGroups) 
        .sort((a, b) => b[1] - a[1]); // Sort by count, descending
    
    const topAccommodationGroups = sortedAccommodationGroups.slice(0, 3); 
    const otherAccommodationGroups = sortedAccommodationGroups.slice(3);

    const otherCount = otherAccommodationGroups.reduce((acc, group) => acc + group[1], 0);

    const finalAccommodationGroups = Object.fromEntries(topAccommodationGroups); 
    if (otherCount > 0) { 
        finalAccommodationGroups['Others'] = otherCount; 
    }
    
    return finalAccommodationGroups;    
}

/**
 * Compute groups by gender

 */
async function computeGenderGroup(datapoints , month=null) {

    // Filter data by month
    const filteredData = datapoints.filter(data => new Date(data.StartDate).getMonth() + 1 === Number(month));

    const genderGroups = filteredData.reduce((acc, person) => {
        const genderGroup = person['Traveler gender'];
        if (genderGroup) {
            acc[genderGroup] = (acc[genderGroup] || 0) + 1;
        }
        return acc
    }, {});
    
    return genderGroups;    
}

/**
 * Compute groups by transportation
 * @param {} datapoints 
 * @param {*} month 
 * @returns 
 */
async function computeTransportationGroup(datapoints, month=null) {

    // Filter data by month
    const filteredData = datapoints.filter(data => new Date(data.StartDate).getMonth() + 1 === Number(month));

    const transportationGroups = filteredData.reduce((acc, person) => {
        const transportationGroup = person['Transportation type'];
        if (transportationGroup) {
            acc[transportationGroup] = (acc[transportationGroup] || 0) + 1;
        }
        return acc;
    }, {});   

    const sortedTransportationGroups = Object.entries(transportationGroups) 
        .sort((a, b) => b[1] - a[1]); // Sort by count, descending
    
    const topTransportationGroups = sortedTransportationGroups.slice(0, 4); 
    const otherTransportationGroups = sortedTransportationGroups.slice(4, sortedTransportationGroups.length);

    const otherCount = otherTransportationGroups.reduce((acc, group) => acc + group[1], 0);

    const finalTransportationGroups = Object.fromEntries(topTransportationGroups); 
    if (otherCount > 0) { 
        finalTransportationGroups['Others'] = otherCount; 
    }
    
    return finalTransportationGroups;    
}

/**
 * Computes the average spending on accommodation and transportation by month.

 */
async function computeAvgSpendingPlace(datapoints, month=null) {

    let spendingByPlace = {};

    // Filter data by month
    const filteredData = datapoints.filter(data => new Date(data.StartDate).getMonth() + 1 === Number(month));


    // Assuming you have parsed the CSV data into an array of objects called "trips"
    filteredData.forEach((trip) => {
        const place = trip['Destination'];
        if(place){
            const cityName = place.split(',')[0].trim();
            if (!spendingByPlace[place]) {
                spendingByPlace[place] = { cityName: cityName, place: place, accommodation: 0, transportation: 0, total: 0 };
            }
            const accommodationCost = parseFloat(trip['Accommodation cost']);
            const transportationCost = parseFloat(trip['Transportation cost']);

            if (accommodationCost && transportationCost) {                
                spendingByPlace[place].accommodation += accommodationCost;
                spendingByPlace[place].transportation += transportationCost;
                spendingByPlace[place].total += (accommodationCost + transportationCost)/1000;
            }           
        }
    });

    // Convert the spendingByPlace object into an array for easier charting
    let chartData = Object.keys(spendingByPlace).map(place => ({
        place,
        cityName: spendingByPlace[place].cityName,
        accommodation: spendingByPlace[place].accommodation,
        transportation: spendingByPlace[place].transportation,
        total: spendingByPlace[place].total
    }));
    
    // Sort the chartData by total expenses 
    chartData.sort((a, b) =>  a.total - b.total);

    // Extract top five and bottom five places 
    const topers = chartData.slice(0, 4); 
    const bottoms = chartData.slice(-12);

    // Combine top five and bottom five 
    const finalChartData = [...topers, ...bottoms];

    return finalChartData;
}

/**
 * Computes the average spending per month for a given destination.
 * @param {*} datapoints 
 *  
 * @param {*} month 
 * @param {*} destination
 * @returns 
 */

async function computeAvgSpendingPlaceMonth(datapoints, destination = null) {
    let spendingByMonth = {};

    // Initialize all months with default values
    const months = [
        { month: 'Jan', monthNumber: 1 },
        { month: 'Feb', monthNumber: 2 },
        { month: 'Mar', monthNumber: 3 },
        { month: 'Apr', monthNumber: 4 },
        { month: 'May', monthNumber: 5 },
        { month: 'Jun', monthNumber: 6 },
        { month: 'Jul', monthNumber: 7 },
        { month: 'Aug', monthNumber: 8 },
        { month: 'Sep', monthNumber: 9 },
        { month: 'Oct', monthNumber: 10 },
        { month: 'Nov', monthNumber: 11 },
        { month: 'Dec', monthNumber: 12 }
        ];

    months.forEach(({ month, monthNumber }) => {
        spendingByMonth[month] = {
            cityName: null,
            monthNumber: monthNumber,
            accommodation: 0,
            transportation: 0,
            total: 0
        };
    });

    // Filter data by month and update spendingByMonth
    datapoints
    .filter(data => (destination === null || data['Destination'] === destination))
    .forEach(data => {
        const month = new Date(data.StartDate).toLocaleString('en-US', { month: 'short' });
        const cityName = data['Destination'];
        const accommodationCost = parseFloat(data['Accommodation cost']);
        const transportationCost = parseFloat(data['Transportation cost']);

        if (!spendingByMonth[month]) {
            console.warn(`Month ${month} is not initialized in spendingByMonth.`);
          } else {
            spendingByMonth[month].cityName = cityName;
            spendingByMonth[month].accommodation += accommodationCost;
            spendingByMonth[month].transportation += transportationCost;
            spendingByMonth[month].total += (accommodationCost + transportationCost) / 1000;
          }
    });

    // Check for missing months and add with the provided destination if needed
    months.forEach(({ month }) => {
        if (spendingByMonth[month].cityName === null && destination !== null) {
            spendingByMonth[month].cityName = destination;
        }
    });

    // Convert the spendingByMonth object into an array for easier charting
    let chartData = Object.keys(spendingByMonth).map(month => ({
        month,
        monthNumber: spendingByMonth[month].monthNumber,
        cityName: spendingByMonth[month].cityName,
        accommodation: spendingByMonth[month].accommodation,
        transportation: spendingByMonth[month].transportation,
        total: spendingByMonth[month].total
    }));

    // Sort the chartData by month
    chartData.sort((a, b) => a.monthNumber - b.monthNumber);

    return chartData;
}



/**
 * Process data to get the most frequent weather condition per location
 *  */ 
async function computeAvgWeatherPlaceMonth(datapoints, destination = null) {
    let weatherByMonth = {};

    // Initialize all months with default values
    const months = [
    { month: 'Jan', monthNumber: 1 },
    { month: 'Feb', monthNumber: 2 },
    { month: 'Mar', monthNumber: 3 },
    { month: 'Apr', monthNumber: 4 },
    { month: 'May', monthNumber: 5 },
    { month: 'Jun', monthNumber: 6 },
    { month: 'Jul', monthNumber: 7 },
    { month: 'Aug', monthNumber: 8 },
    { month: 'Sep', monthNumber: 9 },
    { month: 'Oct', monthNumber: 10 },
    { month: 'Nov', monthNumber: 11 },
    { month: 'Dec', monthNumber: 12 }
    ];

    months.forEach(({ month, monthNumber }) => {
        weatherByMonth[month] = {
            monthNumber: monthNumber,
            mintemp: [],
            maxtemp: [],
            avgtemp: []
        };
    });

    // Filter data by destination if provided
    const filteredData = destination ? datapoints.filter(data => data['Destination'] === destination) : datapoints;

    // Group data by month and update weatherByMonth
    filteredData.forEach(data => {
        const month = new Date(data['Start date']).toLocaleString('en-US', { month: 'short' });
        const monthNumber = new Date(data['Start date']).getMonth() + 1;
        const mintemp = parseFloat(data['mintemp_c']);
        const maxtemp = parseFloat(data['maxtemp_c']);
        const avgtemp = parseFloat(data['avgtemp_c']);

        if (!weatherByMonth[month]) {
            weatherByMonth[month] = { monthNumber, mintemp: [], maxtemp: [], avgtemp: [] };
        }

        weatherByMonth[month].mintemp.push(mintemp);
        weatherByMonth[month].maxtemp.push(maxtemp);
        weatherByMonth[month].avgtemp.push(avgtemp);
    });

    // Check for missing months and add default values if needed
    months.forEach(({ month }) => {
    if (!weatherByMonth[month].mintemp.length) {
        weatherByMonth[month].mintemp.push(null);
    }
    if (!weatherByMonth[month].maxtemp.length) {
        weatherByMonth[month].maxtemp.push(null);
    }
    if (!weatherByMonth[month].avgtemp.length) {
        weatherByMonth[month].avgtemp.push(null);
    }
    });

    // Calculate averages, max, and min for each month
    let chartData = Object.keys(weatherByMonth).map(month => ({
        month,
        monthNumber: weatherByMonth[month].monthNumber,
        AvgTemp_Mean: weatherByMonth[month].avgtemp.reduce((a, b) => a + b, 0) / weatherByMonth[month].avgtemp.length,
        AvgTemp_Max: Math.max(...weatherByMonth[month].avgtemp),
        AvgTemp_Min: Math.min(...weatherByMonth[month].avgtemp),
        MaxTemp_Max: Math.max(...weatherByMonth[month].maxtemp),
        MinTemp_Min: Math.min(...weatherByMonth[month].mintemp)
    }));

    // Sort the chartData by month number
    chartData.sort((a, b) => a.monthNumber - b.monthNumber);

    return chartData;
  }  


  /**
 * Process data to get the most frequent weather condition per location
 *  */ 
function computeMostFrequentWeather(datapoints, month) {
    // Filter data by month
    const filteredData = datapoints.filter(data => new Date(data.StartDate).getMonth() + 1 === Number(month));      
  
    const frequencyMap = filteredData.reduce((acc, location) => {
      const key = `${location.lat},${location.lon}`;
      if (!acc[key]) {
        acc[key] = {
          mintemp_c: [],
          maxtemp_c: []
        };
      }
      const condition = location.condition_text;
      if (!acc[key][condition]) {
        acc[key][condition] = {
          count: 0,
          data: location
        };
      }
      acc[key][condition].count++;
      acc[key].mintemp_c.push(location.mintemp_c);
      acc[key].maxtemp_c.push(location.maxtemp_c);
      return acc;
    }, {});
  
    const mostFrequentData = Object.values(frequencyMap).map(conditionMap => {
      const mostFrequentCondition = Object.keys(conditionMap).reduce((a, b) => conditionMap[a].count > conditionMap[b].count ? a : b);
      const locationData = conditionMap[mostFrequentCondition].data;
      locationData.mintemp_c = Math.min(...conditionMap.mintemp_c);
      locationData.maxtemp_c = Math.max(...conditionMap.maxtemp_c);
      return locationData;
    });
  
    return mostFrequentData;
  }  


export {computeAgeGroup, 
        computeAccomodationGroup, 
        computeGenderGroup,
        computeAvgSpendingPlace,
        computeTransportationGroup,
        computeMostFrequentWeather,
        computeAvgSpendingPlaceMonth,
        computeAvgWeatherPlaceMonth
    }