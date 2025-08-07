const fs = require('fs');

function parseRoute(routeTxt){
    const distances = new Map()
    const cities = new Set()

    for(const txtLine of routeTxt.trim().split('\n')){
        const route = txtLine.split(' = ')[0]
        const distance = parseInt(txtLine.split(' = ')[1])

        const city1 = route.split(' to ')[0]
        const city2 = route.split(' to ')[1]

        cities.add(city1)
        cities.add(city2)

        distances.set(`${city1}-${city2}`, distance)
        distances.set(`${city2}-${city1}`, distance)
    }

    return {cities, distances}
}

function permutator (inputArr) {
    let result = [];
  
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
}

function calculateRouteDistance(route, distances) {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const key = `${route[i]}-${route[i + 1]}`;
        total += distances.get(key);
    }
    return total;
}

function calcSortestRoute(parsedRoute){
    const {cities, distances} = parsedRoute

    const permutations = permutator([...cities])

    let shortestDistance = Infinity
    let shortestRoute = null;

    for (const route of permutations) {
        const distance = calculateRouteDistance(route, distances);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            shortestRoute = route;
        }
    }
    
    return { route: shortestRoute , distance: shortestDistance};
}

function solve(){
    const santaRoute = fs.readFileSync('../Inputs/day09.txt','utf8')
    const parsedRoute = parseRoute(santaRoute)
    const shortestRoute = calcSortestRoute(parsedRoute)

    console.log(shortestRoute)
}

solve() 