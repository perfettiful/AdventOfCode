const fs = require('fs');

// --- Part 1 --- //

// Read and parse the input
function parseReindeer(input) {
    const reindeer = [];
    const lines = input.trim().split('\n');
    
    for (const line of lines) {
        // Parse: "Name can fly X km/s for Y seconds, but then must rest for Z seconds."
        const match = line.match(/(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./);
        if (match) {
            const [, name, speed, flyTime, restTime] = match;
            reindeer.push({
                name,
                speed: parseInt(speed),
                flyTime: parseInt(flyTime),
                restTime: parseInt(restTime)
            });
        }
    }
    
    return reindeer;
}

// Calculate distance traveled by a reindeer after given seconds
function calculateDistance(reindeer, totalSeconds) {
    const cycleTime = reindeer.flyTime + reindeer.restTime;
    const completeCycles = Math.floor(totalSeconds / cycleTime);
    const remainingTime = totalSeconds % cycleTime;
    
    // Distance from complete cycles
    let distance = completeCycles * reindeer.speed * reindeer.flyTime;
    
    // Distance from remaining partial cycle
    const flyingTimeInRemainder = Math.min(remainingTime, reindeer.flyTime);
    distance += flyingTimeInRemainder * reindeer.speed;
    
    return distance;
}

// Test with the example from the problem
function testExample() {
    const testReindeer = [
        { name: 'Comet', speed: 14, flyTime: 10, restTime: 127 },
        { name: 'Dancer', speed: 16, flyTime: 11, restTime: 162 }
    ];
    
    console.log('Testing example:');
    for (const reindeer of testReindeer) {
        const distance = calculateDistance(reindeer, 1000);
        console.log(`${reindeer.name}: ${distance} km`);
    }
    console.log('Expected: Comet 1120 km, Dancer 1056 km\n');
}

// Main solution
function solvePart1() {
    const input = fs.readFileSync('../Inputs/day14.txt', 'utf8');
    const reindeer = parseReindeer(input);
    
    console.log('Reindeer stats:');
    reindeer.forEach(r => {
        console.log(`${r.name}: ${r.speed} km/s for ${r.flyTime}s, rest ${r.restTime}s`);
    });
    console.log();
    
    const raceTime = 2503;
    let maxDistance = 0;
    let winner = '';
    
    console.log(`After ${raceTime} seconds:`);
    for (const deer of reindeer) {
        const distance = calculateDistance(deer, raceTime);
        console.log(`${deer.name}: ${distance} km`);
        
        if (distance > maxDistance) {
            maxDistance = distance;
            winner = deer.name;
        }
    }
    
    console.log(`\nWinner: ${winner} with ${maxDistance} km`);
    return maxDistance;
}

// --- Part 2 --- //

// Calculate if a reindeer is flying at a given second
function isFlying(reindeer, second) {
    const cycleTime = reindeer.flyTime + reindeer.restTime;
    const positionInCycle = (second - 1) % cycleTime; // -1 because we start at second 1
    return positionInCycle < reindeer.flyTime;
}

// Calculate distance at a specific second (for part 2)
function getDistanceAtSecond(reindeer, second) {
    let distance = 0;
    for (let s = 1; s <= second; s++) {
        if (isFlying(reindeer, s)) {
            distance += reindeer.speed;
        }
    }
    return distance;
}

// Test part 2 with the example
function testExamplePart2() {
    const testReindeer = [
        { name: 'Comet', speed: 14, flyTime: 10, restTime: 127 },
        { name: 'Dancer', speed: 16, flyTime: 11, restTime: 162 }
    ];
    
    console.log('Testing Part 2 example:');
    const points = solvePart2WithReindeer(testReindeer, 1000);
    console.log('Expected: Dancer 689 points, Comet 312 points\n');
    return points;
}

// Solve part 2 with given reindeer (for testing)
function solvePart2WithReindeer(reindeer, totalSeconds) {
    // Initialize points for each reindeer
    const points = {};
    reindeer.forEach(deer => points[deer.name] = 0);
    
    // Simulate each second
    for (let second = 1; second <= totalSeconds; second++) {
        // Calculate current distances for all reindeer
        const distances = {};
        let maxDistance = 0;
        
        for (const deer of reindeer) {
            distances[deer.name] = getDistanceAtSecond(deer, second);
            maxDistance = Math.max(maxDistance, distances[deer.name]);
        }
        
        // Award points to all reindeer tied for the lead
        for (const deer of reindeer) {
            if (distances[deer.name] === maxDistance) {
                points[deer.name]++;
            }
        }
    }
    
    // Display results
    for (const deer of reindeer) {
        console.log(`${deer.name}: ${points[deer.name]} points`);
    }
    
    return points;
}

// Main part 2 solution
function solvePart2() {
    const input = fs.readFileSync('../Inputs/day14.txt', 'utf8');
    const reindeer = parseReindeer(input);
    
    console.log('=== Part 2: New Scoring System ===');
    const raceTime = 2503;
    
    const points = solvePart2WithReindeer(reindeer, raceTime);
    
    // Find winner
    let maxPoints = 0;
    let winner = '';
    
    for (const deer of reindeer) {
        if (points[deer.name] > maxPoints) {
            maxPoints = points[deer.name];
            winner = deer.name;
        }
    }
    
    console.log(`\nPart 2 Winner: ${winner} with ${maxPoints} points`);
    return maxPoints;
}

testExample();
solvePart1();
console.log('\n');
testExamplePart2();
solvePart2();