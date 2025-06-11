const fs = require('fs');
const path = require('path');

/**
 * Calculates the ribbon needed for a box with given dimensions
 * @param {number} l - length
 * @param {number} w - width  
 * @param {number} h - height
 * @returns {number} total ribbon needed (wrapping + bow)
 */
function calculateRibbon(l, w, h) {
    // Sort dimensions to easily find the two smallest
    const [a, b, c] = [l, w, h].sort((x, y) => x - y);
    
    // Ribbon for wrapping is the smallest perimeter (2 * sum of two smallest sides)
    const wrappingRibbon = 2 * (a + b);
    
    // Ribbon for bow is the volume
    const bowRibbon = l * w * h;
    
    return wrappingRibbon + bowRibbon;
}

/**
 * Parses a dimension string like "2x3x4" into [l, w, h]
 * @param {string} dimensionStr - dimension string
 * @returns {number[]} array of [length, width, height]
 */
function parseDimensions(dimensionStr) {
    return dimensionStr.trim().split('x').map(Number);
}

/**
 * Main function to solve the ribbon problem
 */
function solve() {
    try {
        // Read input file from current directory
        const inputPath = path.join(__dirname, 'inputs2.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        
        // Process each line and calculate total
        const totalRibbon = input
            .trim()
            .split('\n')
            .map(parseDimensions)
            .map(([l, w, h]) => calculateRibbon(l, w, h))
            .reduce((sum, ribbon) => sum + ribbon, 0);
        
        console.log(`Total feet of ribbon needed: ${totalRibbon}`);
        return totalRibbon;
    } catch (error) {
        console.error('Error reading input file:', error.message);
        process.exit(1);
    }
}

/**
 * Combined solution that calculates both wrapping paper and ribbon
 * @param {number} l - length
 * @param {number} w - width
 * @param {number} h - height
 * @returns {object} object with paper and ribbon totals
 */
function calculateBoth(l, w, h) {
    // Calculate sides for paper calculation
    const side1 = l * w;
    const side2 = w * h;
    const side3 = h * l;
    
    // Paper calculation
    const surfaceArea = 2 * (side1 + side2 + side3);
    const slack = Math.min(side1, side2, side3);
    const paper = surfaceArea + slack;
    
    // Ribbon calculation
    const [a, b, c] = [l, w, h].sort((x, y) => x - y);
    const wrappingRibbon = 2 * (a + b);
    const bowRibbon = l * w * h;
    const ribbon = wrappingRibbon + bowRibbon;
    
    return { paper, ribbon };
}

/**
 * Solve both problems at once for efficiency
 */
function solveBoth() {
    try {
        const inputPath = path.join(__dirname, 'inputs1.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        
        const totals = input
            .trim()
            .split('\n')
            .map(parseDimensions)
            .map(([l, w, h]) => calculateBoth(l, w, h))
            .reduce(
                (acc, curr) => ({
                    paper: acc.paper + curr.paper,
                    ribbon: acc.ribbon + curr.ribbon
                }),
                { paper: 0, ribbon: 0 }
            );
        
        console.log(`Total wrapping paper: ${totals.paper} square feet`);
        console.log(`Total ribbon: ${totals.ribbon} feet`);
        return totals;
    } catch (error) {
        console.error('Error reading input file:', error.message);
        process.exit(1);
    }
}

// Run the solution if this file is executed directly
if (require.main === module) {
    solve();
    console.log('---');
    solveBoth();
}

module.exports = { calculateRibbon, calculateBoth, parseDimensions, solve, solveBoth };
