const fs = require('fs');

function parseHappiness(input){

    const happiness = new Map();
    const people = new Set();

    for (const line of input.trim().split('\n')){


        const parts = line.split(" ")
        const person1 = parts[0]
        const person2 = parts[parts.length-1].replace(".", "")

        const sign = (parts[2] === 'lose') ? -1 : 1;
        const unit = parseInt(parts[3])

        const happinessValue = sign * unit

        people.add(person1)
        people.add(person2)

        happiness.set(`${person1}, ${person2}`, happinessValue)
        
    }

    const peopleArr = Array.from(people)

    return { happiness, people: peopleArr }

}

function permutator(inputArr) {
    let result = [];
    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    };
    permute(inputArr);
    return result;
}

function calcHappiness(happiness, arrangements){

    let runningTotal = 0;

    for(let i = 0; i < arrangements.length; i++){
        const person = arrangements[i]

        const leftPerson = arrangements.at(i - 1)
        const rightPerson = arrangements.at((i + 1) % arrangements.length)

        // console.log("Neightbors for ", person, leftPerson, rightPerson)

        // console.log(happiness.get(`${person}, ${leftPerson}`))
        runningTotal += happiness.get(`${person}, ${leftPerson}`)
        
        runningTotal += happiness.get(`${person}, ${rightPerson}`)
    }

    console.log(runningTotal)

    return runningTotal;
}

function opitimalSeating(happiness, people){

    const permutations =  permutator(people);

    let maxHappiness = 0;

    for(const arrangements of permutations){

        const totalHappiness = calcHappiness(happiness, arrangements)

        if (totalHappiness > maxHappiness){

            maxHappiness = totalHappiness
        }

    }

    console.log({maxHappiness})

    return maxHappiness;

}

function solve13(){
    const input = fs.readFileSync('../Inputs/day13.txt', 'utf8');

    const {happiness, people} = parseHappiness(input)

    console.log('People: ',people )
    console.log('Happiness Table: ',happiness )

    const result = opitimalSeating(happiness, people)


}

solve13()

//
// People:  [
//     'Alice',  'Bob',
//     'Carol',  'David',
//     'Eric',   'Frank',
//     'George', 'Mallory'
//   ]
//   Happiness Table:  Map(56) {
//     [ 'Alice', 'Bob' ] => -2,
//     [ 'Alice', 'Carol' ] => -62,
//     [ 'Alice', 'David' ] => 65,
//     [ 'Alice', 'Eric' ] => 21,
//     [ 'Alice', 'Frank' ] => -81,
//     [ 'Alice', 'George' ] => -4,
//     [ 'Alice', 'Mallory' ] => -80,
//     [ 'Bob', 'Alice' ] => 93,
//     [ 'Bob', 'Carol' ] => 19,
//     [ 'Bob', 'David' ] => 5,
//     [ 'Bob', 'Eric' ] => 49,
//     [ 'Bob', 'Frank' ] => 68,
//     [ 'Bob', 'George' ] => 23,
//     [ 'Bob', 'Mallory' ] => 29,
//     [ 'Carol', 'Alice' ] => -54,
//     [ 'Carol', 'Bob' ] => -70,
//     [ 'Carol', 'David' ] => -37,
//     [ 'Carol', 'Eric' ] => -46,
//     [ 'Carol', 'Frank' ] => 33,
//     [ 'Carol', 'George' ] => -35,
//     [ 'Carol', 'Mallory' ] => 10,
//     [ 'David', 'Alice' ] => 43,
//     [ 'David', 'Bob' ] => -96,
//     [ 'David', 'Carol' ] => -53,
//     [ 'David', 'Eric' ] => -30,
//     [ 'David', 'Frank' ] => -12,
//     [ 'David', 'George' ] => 75,
//     [ 'David', 'Mallory' ] => -20,
//     [ 'Eric', 'Alice' ] => 8,
//     [ 'Eric', 'Bob' ] => -89,
//     [ 'Eric', 'Carol' ] => -69,
//     [ 'Eric', 'David' ] => -34,
//     [ 'Eric', 'Frank' ] => 95,
//     [ 'Eric', 'George' ] => 34,
//     [ 'Eric', 'Mallory' ] => -99,
//     [ 'Frank', 'Alice' ] => -97,
//     [ 'Frank', 'Bob' ] => 6,
//     [ 'Frank', 'Carol' ] => -9,
//     [ 'Frank', 'David' ] => 56,
//     [ 'Frank', 'Eric' ] => -17,
//     [ 'Frank', 'George' ] => 18,
//     [ 'Frank', 'Mallory' ] => -56,
//     [ 'George', 'Alice' ] => 45,
//     [ 'George', 'Bob' ] => 76,
//     [ 'George', 'Carol' ] => 63,
//     [ 'George', 'David' ] => 54,
//     [ 'George', 'Eric' ] => 54,
//     [ 'George', 'Frank' ] => 30,
//     [ 'George', 'Mallory' ] => 7,
//     [ 'Mallory', 'Alice' ] => 31,
//     [ 'Mallory', 'Bob' ] => -32,
//     [ 'Mallory', 'Carol' ] => 95,
//     [ 'Mallory', 'David' ] => 91,
//     [ 'Mallory', 'Eric' ] => -66,
//     [ 'Mallory', 'Frank' ] => -75,
//     [ 'Mallory', 'George' ] => -99
//   }
///