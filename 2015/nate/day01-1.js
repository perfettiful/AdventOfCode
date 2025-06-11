const fs = require('fs');
const path = require('path');

/**
 * Calculates the wrapping paper needed for a box with given dimensions
 * @param {number} l - length
 * @param {number} w - width  
 * @param {number} h - height
 * @returns {number} total wrapping paper needed (surface area + slack)
 */
function calculateWrappingPaper(l, w, h) {
    // Calculate the three side areas
    const side1 = l * w;
    const side2 = w * h;
    const side3 = h * l;
    
    // Surface area is 2 times each side
    const surfaceArea = 2 * (side1 + side2 + side3);
    
    // Slack is the area of the smallest side
    const slack = Math.min(side1, side2, side3);
    
    return surfaceArea + slack;
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
 * Main function to solve the wrapping paper problem
 */
function solve() {
    try {
        // Read input file
        const inputPath = path.join(__dirname, '..', 'inputs.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        
        // Process each line and calculate total
        const totalPaper = input
            .trim()
            .split('\n')
            .map(parseDimensions)
            .map(([l, w, h]) => calculateWrappingPaper(l, w, h))
            .reduce((sum, paper) => sum + paper, 0);
        
        console.log(`Total square feet of wrapping paper needed: ${totalPaper}`);
        return totalPaper;
    } catch (error) {
        console.error('Error reading input file:', error.message);
        process.exit(1);
    }
}

// Run the solution if this file is executed directly
if (require.main === module) {
    solve();
}

module.exports = { calculateWrappingPaper, parseDimensions, solve };
