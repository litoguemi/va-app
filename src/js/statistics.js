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
        console.log('inside computing:'+mostVisited+' - '+maxVisits+' - '+leastVisited+' - '+minVisits);
        
        return {mostVisited, maxVisits, leastVisited, minVisits};
    }
};
 

 export { MostVisitedCity };