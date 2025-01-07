class Statistic {
    constructor() {
       if(this.constructor == Statistic) {
          throw new Error("Class is of abstract type and can't be instantiated");
       };       
    }   
       
    async compute(data){
        throw new Error("Abstract method 'compute' must be implemented in derived classes.");
    };
 }
 

 class MostVisitedCity extends Statistic {    
    async compute(trips){
        // Count visits for each destination
        const destinationCount = trips.reduce((acc, trip) => {
            acc[trip['Destination']] = (acc[trip['Destination']] || 0) + 1;
            return acc;
        }, {});
        
        // Find the most, least visited destination
        let mostVisited = null;
        let maxVisits = 0;
        let leastVisited = null;
        let minVisits = Infinity;
        
        for (const [destination, count] of Object.entries(destinationCount)) {
            if (count > maxVisits) {
                mostVisited = destination;
                maxVisits = count;
            }
            if (count < minVisits) {               
                leastVisited = destination; 
                minVisits = count;                
            }
        }
        return {mostVisited, maxVisits, leastVisited, minVisits};
    }
};

class WeatherExtremes extends Statistic {
    
      
    async computeMonthlyAverages(weatherData, months = null) {
        const monthlyData = {};
    
        weatherData.forEach(data => {
            const date = data.StartDate; // Assuming the date is in the format "DD/MM/YYYY"
            
            if(!date) {
                return; // Skip if date is undefined or null
            }

            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
            if (months && !months.includes(date.getMonth() + 1)) {
                return; // Skip months not in the specified list
            }
        
            if (!monthlyData[data.Destination]) {
                monthlyData[data.Destination] = {};
            }
        
            if (!monthlyData[data.Destination][monthKey]) {
                monthlyData[data.Destination][monthKey] = {
                    totalprecip_mm: 0,
                    maxtemp_c: 0,
                    avgtemp_c: 0,
                    count: 0,
                    avgvis_km: 0
                };
            }
        
            monthlyData[data.Destination][monthKey].totalprecip_mm += data.totalprecip_mm;
            monthlyData[data.Destination][monthKey].maxtemp_c += data.maxtemp_c;
            monthlyData[data.Destination][monthKey].avgtemp_c += data.avgtemp_c;
            monthlyData[data.Destination][monthKey].avgvis_km += data.avgvis_km;
            monthlyData[data.Destination][monthKey].count += 1;
        });
    
        const monthlyAverages = [];
    
        for (const destination in monthlyData) {
            for (const month in monthlyData[destination]) {
            const averages = monthlyData[destination][month];
            monthlyAverages.push({
                destination,
                month,
                totalprecip_mm: averages.totalprecip_mm / averages.count,
                maxtemp_c: averages.maxtemp_c / averages.count,
                avgtemp_c: averages.avgtemp_c / averages.count,
                avgvis_km: averages.avgvis_km / averages.count
            });
            }
        }
    
        return monthlyAverages;
    }
      
    async compute(weather, months = null) {

        const monthlyAverages = await this.computeMonthlyAverages(weather, months);

        let mostRainy = monthlyAverages[0];
        let mostSunny = monthlyAverages[0];
        let coldest = monthlyAverages[0];
        let hottest = monthlyAverages[0];
      
        monthlyAverages.forEach(data => {
          if (data.totalprecip_mm > mostRainy.totalprecip_mm) {
            mostRainy = data;
          }
          if (data.avgvis_km >= mostSunny.avgvis_km && data.totalprecip_mm == 0) {
            mostSunny = data;
          }
          if (data.avgtemp_c < coldest.avgtemp_c) {
            coldest = data;
          }
          if (data.maxtemp_c > hottest.maxtemp_c) {
            hottest = data;
          }
        });      
        
        return { mostRainy, mostSunny, coldest, hottest };
      }
};
 

 export { MostVisitedCity, WeatherExtremes };