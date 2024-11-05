export const load = async ({ fetch }) => {
    const responseFlowers = await fetch('https://raw.githubusercontent.com/domoritz/maps/master/data/iris.json')
    const dataFlowers = await responseFlowers.json()
    dataFlowers.forEach((d,i) => { d.id = i; 
                                   d.species = "Iris " + d.species; 
                                   d.sepal_length = d.petalLength; 
                                   d.sepal_width = d.sepalWidth;
                                })
  
    return { flowers: dataFlowers }
}