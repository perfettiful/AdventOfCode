const fs = require('fs');
const path = require('path');

function createLightGrid() {
    const grid = [];
    for (let i = 0; i < 1000; i++) {
        grid[i] = [];
        for (let j = 0; j < 1000; j++) {
            grid[i][j] = 0; // 0 = minimum brightness
        }
    }
    return grid;
}

function parseInstruction(instruction) {
    const parts = instruction.split(' ');
    
    if (parts[0] === 'toggle') {
        // toggle 0,0 through 999,0
        const startCoords = parts[1].split(',').map(Number);
        const endCoords = parts[3].split(',').map(Number);
        return {
            action: 'toggle',
            startX: startCoords[0],
            startY: startCoords[1],
            endX: endCoords[0],
            endY: endCoords[1]
        };
    } else {
        // turn on/off 0,0 through 999,999
        const action = parts[1]; // 'on' or 'off'
        const startCoords = parts[2].split(',').map(Number);
        const endCoords = parts[4].split(',').map(Number);
        return {
            action: action,
            startX: startCoords[0],
            startY: startCoords[1],
            endX: endCoords[0],
            endY: endCoords[1]
        };
    }
}

function applyInstruction(grid, instruction) {
    for (let x = instruction.startX; x <= instruction.endX; x++) {
        for (let y = instruction.startY; y <= instruction.endY; y++) {
            if (instruction.action === 'on') {
                grid[x][y] += 1; // Increase brightness by 1
            } else if (instruction.action === 'off') {
                grid[x][y] = Math.max(0, grid[x][y] - 1); // Decrease brightness by 1, minimum 0
            } else if (instruction.action === 'toggle') {
                grid[x][y] += 2; // Increase brightness by 2
            }
        }
    }
}

function calculateTotalBrightness(grid) {
    let total = 0;
    for (let x = 0; x < 1000; x++) {
        for (let y = 0; y < 1000; y++) {
            total += grid[x][y];
        }
    }
    return total;
}

function processInstructions(instructions) {
    const grid = createLightGrid();
    
    for (let i = 0; i < instructions.length; i++) {
        const instruction = parseInstruction(instructions[i]);
        applyInstruction(grid, instruction);
    }
    
    return calculateTotalBrightness(grid);
}
function solvePart2() {
    try {
        const inputPath = path.join(__dirname, '..', 'Inputs', 'day06.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        const instructions = input.trim().split('\n');
        
        const totalBrightness = processInstructions(instructions);
        console.log(`Total brightness: ${totalBrightness}`);
        return totalBrightness;
    } catch (error) {
        console.error('Error reading input file:', error.message);
        process.exit(1);
    }
}

const example1 = ['turn on 0,0 through 0,0'];
const result1 = processInstructions(example1);
console.log(`Example 1 - turn on 0,0 through 0,0: ${result1} total brightness`);

const example2 = ['toggle 0,0 through 999,999'];
const result2 = processInstructions(example2);
console.log(`Example 2 - toggle 0,0 through 999,999: ${result2} total brightness`);

const example3 = [
    'turn on 0,0 through 1,1', // 4 lights × 1 = 4 brightness
    'toggle 0,0 through 0,0',  // 1 light × 2 = 2 additional brightness
    'turn off 1,1 through 1,1' // 1 light × -1 = -1 brightness
];
const result3 = processInstructions(example3);

