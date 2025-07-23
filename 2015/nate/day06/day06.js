const fs = require('fs');
const path = require('path');


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
                grid[x][y] = true;
            } else if (instruction.action === 'off') {
                grid[x][y] = false;
            } else if (instruction.action === 'toggle') {
                grid[x][y] = !grid[x][y];
            }
        }
    }
}

function countLitLights(grid) {
    let count = 0;
    for (let x = 0; x < 1000; x++) {
        for (let y = 0; y < 1000; y++) {
            if (grid[x][y]) {
                count++;
            }
        }
    }
    return count;
}


function processInstructions(instructions) {
    const grid = [];
    // for (let i = 0; i < 1000; i++) {
    //     grid[i] = [];
    //     for (let j = 0; j < 1000; j++) {
    //         grid[i][j] = false; // false = off, true = on
    //     }
    // }
    
    for (let i = 0; i < instructions.length; i++) {
        const instruction = parseInstruction(instructions[i]);
        applyInstruction(grid, instruction);
    }
    
    return countLitLights(grid);
}

function solve() {
    try {
        const inputPath = path.join(__dirname, '..', 'Inputs', 'day06.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        const instructions = input.trim().split('\n');
        
        const litCount = processInstructions(instructions);
        console.log(`Number of lights lit: ${litCount}`);
        return litCount;
    } catch (error) {
        console.error('Error reading input file:', error.message);
        process.exit(1);
    }
}


const example1 = ['turn on 0,0 through 999,999'];
const result1 = processInstructions(example1);
console.log(`Example 1 - turn on 0,0 through 999,999: ${result1} lights lit`);

const example2 = ['toggle 0,0 through 999,0'];
const result2 = processInstructions(example2);
console.log(`Example 2 - toggle 0,0 through 999,0: ${result2} lights lit`);

const example3 = [
    'turn on 0,0 through 999,999', // Turn all on first
    'turn off 499,499 through 500,500' // Turn off middle 4
];
const result3 = processInstructions(example3);
console.log(`Example 3 - turn off 499,499 through 500,500: ${result3} lights lit`);
