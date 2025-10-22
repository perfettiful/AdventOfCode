const fs = require('fs');
const path = require('path');

function readInput(filename) {
    const inputPath = path.join(__dirname, '..', 'Inputs', filename);
    const content = fs.readFileSync(inputPath, 'utf8');
    return content.trim().split('\n').map(line => line.split(''));
}

function countNeighbors(grid, row, col) {
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {

            // Skip the center cell
            if (dr === 0 && dc === 0) continue;

            const newRow = row + dr;
            const newCol = col + dc;

            // Check bounds
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (grid[newRow][newCol] === '#') {
                    count++;
                }
            }
        }
    }

    return count;
}


function simulateStep(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = [];

    for (let row = 0; row < rows; row++) {
        newGrid[row] = [];
        for (let col = 0; col < cols; col++) {
            const currentState = grid[row][col];
            const neighbors = countNeighbors(grid, row, col);

            if (currentState === '#') {
                // Light is on if 2 or 3 neighbors are on
                newGrid[row][col] = (neighbors === 2 || neighbors === 3) ? '#' : '.';
            } else {
                // Light is off if exactly 3 neighbors are on
                newGrid[row][col] = (neighbors === 3) ? '#' : '.';
            }
        }
    }

    return newGrid;
}

function countLights(grid) {
    let count = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col] === '#') {
                count++;
            }
        }
    }
    return count;
}

// Part 2
function fixCornerLights(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    grid[0][0] = '#';              // top-left
    grid[0][cols - 1] = '#';       // top-right
    grid[rows - 1][0] = '#';       // bottom-left
    grid[rows - 1][cols - 1] = '#'; // bottom-right

    return grid;
}

// Part 2
function simulateStepWithStuckCorners(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = [];

    for (let row = 0; row < rows; row++) {
        newGrid[row] = [];
        for (let col = 0; col < cols; col++) {
            const currentState = grid[row][col];
            const neighbors = countNeighbors(grid, row, col);

            // Apply the rules
            if (currentState === '#') {
                // Light is on: stays on if 2 or 3 neighbors are on
                newGrid[row][col] = (neighbors === 2 || neighbors === 3) ? '#' : '.';
            } else {
                // Light is off: turns on if exactly 3 neighbors are on
                newGrid[row][col] = (neighbors === 3) ? '#' : '.';
            }
        }
    }

    // Fix corner lights after applying rules
    return fixCornerLights(newGrid);
}

function solve(filename, steps) {
    let grid = readInput(filename);

    console.log(`Initial state: ${grid.length}x${grid[0].length} grid`);
    console.log(`Lights on initially: ${countLights(grid)}`);

    for (let step = 0; step < steps; step++) {
        grid = simulateStep(grid);
    }

    const finalCount = countLights(grid);
    console.log(`\nAfter ${steps} steps: ${finalCount} lights are on`);

    return finalCount;
}

function solvePart2(filename, steps) {
    let grid = readInput(filename);

    grid = fixCornerLights(grid);

    console.log(`\n--- Part 2 ---`);
    console.log(`Initial state: ${grid.length}x${grid[0].length} grid (corners stuck on)`);
    console.log(`Lights on initially: ${countLights(grid)}`);

    for (let step = 0; step < steps; step++) {
        grid = simulateStepWithStuckCorners(grid);
    }

    const finalCount = countLights(grid);
    console.log(`\nAfter ${steps} steps (with stuck corners): ${finalCount} lights are on`);

    return finalCount;
}

console.log('--- Part 1 ---');
solve('day18.txt', 100);
solvePart2('day18.txt', 100);
