/**
 * Compute groups by age
 */
async function computeAgeGroup(datapoints, month=null){   

    const filteredData = datapoints.filter(data => new Date(data.StartDate).toLocaleString('default', { month: 'long' }) === month);
    
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

    const filteredData = datapoints.filter(data => new Date(data.StartDate).toLocaleString('default', { month: 'long' }) === month);

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

    const filteredData = datapoints.filter(data => new Date(data.StartDate).toLocaleString('default', { month: 'long' }) === month);

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
 * Computes the average spending on accommodation and transportation by destination.

 */
async function computeAvgSpendingPlace(datapoints) {

    let spendingByPlace = {};

    // Assuming you have parsed the CSV data into an array of objects called "trips"
    datapoints.forEach((trip) => {
        const place = trip['Destination'];
        if(place){
            const cityName = place.split(',')[0].trim();
            if (!spendingByPlace[place]) {
                spendingByPlace[place] = { cityName: cityName, accommodation: 0, transportation: 0, total: 0 };
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
    const topers = chartData.slice(0, 5); 
    const bottoms = chartData.slice(-9);

    // Combine top five and bottom five 
    const finalChartData = [...topers, ...bottoms];

    return finalChartData;
}


/**
 * Process data to get the most frequent weather condition per location
 *  */ 
function computeMostFrequentWeather(data, month) {
    const filteredData = data.filter(location => new Date(location.StartDate).toLocaleString('default', { month: 'long' }) === month);

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
        computeMostFrequentWeather 
    }