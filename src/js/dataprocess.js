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
    chartData.sort((a, b) => b.total - a.total);

    // Extract top five and bottom five places 
    const topers = chartData.slice(0, 8); 
    const bottoms = chartData.slice(-10);

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

    // Filter data by month
    datapoints
        .filter(data => (data['Destination'] === destination))
        .forEach(data => {
            const month = new Date(data.StartDate).toLocaleString('default', { month: 'short' });
            const monthNumber = new Date(data.StartDate).getMonth() + 1;
            const cityName = data['Destination'];
            const accommodationCost = parseFloat(data['Accommodation cost']);
            const transportationCost = parseFloat(data['Transportation cost']);

            if (accommodationCost && transportationCost) {
                if (!spendingByMonth[month]) {
                    spendingByMonth[month] = { cityName, monthNumber, accommodation: 0, transportation: 0, total: 0 };
                }

                spendingByMonth[month].accommodation += accommodationCost;
                spendingByMonth[month].transportation += transportationCost;
                spendingByMonth[month].total += (accommodationCost + transportationCost) / 1000;
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
function computeMostFrequentWeather(datapoints, month) {

    // Filter data by month
    const filteredData = datapoints.filter(data => new Date(data.StartDate).getMonth() + 1 === Number(month));      

    const frequencyMap = filteredData.reduce((acc, location) => {
      const key = `${location.lat},${location.lon}`;
      if (!acc[key]) {
        acc[key] = {};
      }
      const condition = location.condition_text;
      if (!acc[key][condition]) {
        acc[key][condition] = {
          count: 0,
          data: location
        };
      }
      acc[key][condition].count++;
      return acc;
    }, {});

    const mostFrequentData = Object.values(frequencyMap).map(conditionMap => {
      const mostFrequentCondition = Object.keys(conditionMap).reduce((a, b) => conditionMap[a].count > conditionMap[b].count ? a : b);
      return conditionMap[mostFrequentCondition].data;
    });

    return mostFrequentData;
  }


export {computeAgeGroup, 
        computeAccomodationGroup, 
        computeGenderGroup,
        computeAvgSpendingPlace,
        computeTransportationGroup,
        computeMostFrequentWeather,
        computeAvgSpendingPlaceMonth
    }