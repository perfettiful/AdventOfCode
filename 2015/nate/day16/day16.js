const fs = require('fs');

const mfcsamReadings = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
};

function parseSueData(inputFile) {
    const data = fs.readFileSync(inputFile, 'utf8');
    const lines = data.trim().split('\n');
    
    const sues = [];
    
    for (const line of lines) {
        const match = line.match(/Sue (\d+): (.+)/);
        if (match) {
            const sueNumber = parseInt(match[1]);
            const attributesStr = match[2];
            
            const attributes = {};
            const pairs = attributesStr.split(', ');
            
            for (const pair of pairs) {
                const [key, value] = pair.split(': ');
                attributes[key] = parseInt(value);
            }
            
            sues.push({
                number: sueNumber,
                attributes: attributes
            });
        }
    }
    
    return sues;
}

function findMatchingSue(sues, targetReadings) {
    for (const sue of sues) {
        let matches = true;
        
        for (const [attribute, value] of Object.entries(sue.attributes)) {
            if (targetReadings[attribute] !== undefined && targetReadings[attribute] !== value) {
                matches = false;
                break;
            }
        }
        
        if (matches) {
            return sue;
        }
    }
    
    return null;
}

function findMatchingSuePart2(sues, targetReadings) {
    for (const sue of sues) {
        let matches = true;
        
        for (const [attribute, value] of Object.entries(sue.attributes)) {
            if (targetReadings[attribute] !== undefined) {

                if (attribute === 'cats' || attribute === 'trees') {
                    if (value <= targetReadings[attribute]) {
                        matches = false;
                        break;
                    }
                } else if (attribute === 'pomeranians' || attribute === 'goldfish') {
                    if (value >= targetReadings[attribute]) {
                        matches = false;
                        break;
                    }
                } else {
                    if (targetReadings[attribute] !== value) {
                        matches = false;
                        break;
                    }
                }
            }
        }
        
        if (matches) {
            return sue;
        }
    }
    
    return null;
}

function solvePart1() {
    const sues = parseSueData('../Inputs/day16.txt');
    const matchingSue = findMatchingSue(sues, mfcsamReadings);
    
    if (matchingSue) {
        console.log(`Part 1: Sue ${matchingSue.number} matches the MFCSAM readings`);
        console.log('Her attributes:', matchingSue.attributes);
        return matchingSue.number;
    } else {
        console.log('No matching Sue found');
        return null;
    }
}

function solvePart2() {
    const sues = parseSueData('../Inputs/day16.txt');
    const matchingSue = findMatchingSuePart2(sues, mfcsamReadings);
    
    if (matchingSue) {
        console.log(`Part 2: Sue ${matchingSue.number} matches the MFCSAM readings with retroencabulator rules`);
        console.log('Her attributes:', matchingSue.attributes);
        return matchingSue.number;
    } else {
        console.log('No matching Sue found for Part 2');
        return null;
    }
}

// Run the solution
console.log('=== Day 16: Aunt Sue ===');
console.log('MFCSAM readings:', mfcsamReadings);
console.log('Part 2 rules:');
console.log('- cats & trees: Sue must have MORE than MFCSAM reading');
console.log('- pomeranians & goldfish: Sue must have FEWER than MFCSAM reading');
console.log('- other attributes: exact match');
console.log();

const result1 = solvePart1();
console.log();
const result2 = solvePart2();
console.log(`\nPart 1 Answer: ${result1}`);
console.log(`Part 2 Answer: ${result2}`);
