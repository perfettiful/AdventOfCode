const fs = require('fs');
const path = require('path');

class Box {
    constructor(length, width, height) {
        this.length = length;
        this.width = width;
        this.height = height;
    }

    static fromString(dimensionStr) {
        const [l, w, h] = dimensionStr.trim().split('x').map(Number);
        return new Box(l, w, h);
    }

    getSides() {
        return [
            this.length * this.width,
            this.width * this.height,
            this.height * this.length
        ];
    }

    getSortedDimensions() {
        return [this.length, this.width, this.height].sort((a, b) => a - b);
    }
}

class BoxCalculator {
    constructor() {
        this.calculators = new Map();
    }

    addCalculator(name, fn) {
        this.calculators.set(name, fn);
        return this;
    }

    calculate(l, w, h) {
        const results = {};
        for (const [name, calc] of this.calculators) {
            results[name] = calc(l, w, h);
        }
        return results;
    }

    calculateForBox(box) {
        return this.calculate(box.length, box.width, box.height);
    }
}

function calculateWrappingPaper(l, w, h) {
    const sides = [l * w, w * h, h * l];
    const surfaceArea = 2 * sides.reduce((sum, side) => sum + side, 0);
    const slack = Math.min(...sides);
    return surfaceArea + slack;
}

function calculateRibbon(l, w, h) {
    const [a, b] = [l, w, h].sort((x, y) => x - y);
    const wrappingRibbon = 2 * (a + b);
    const bowRibbon = l * w * h;
    return wrappingRibbon + bowRibbon;
}

function calculateTape(l, w, h) {
    const perimeter = 2 * (l + w + h);
    return perimeter * 1.5;
}

function calculateLabels(l, w, h) {
    const sides = [l * w, w * h, h * l];
    return sides.length * 2;
}

class PackagingCalculator {
    constructor(inputFile = 'inputs1.txt') {
        this.inputFile = inputFile;
        this.boxes = [];
        this.calculator = new BoxCalculator();
        this.setupDefaultCalculators();
    }

    setupDefaultCalculators() {
        this.calculator
            .addCalculator('paper', calculateWrappingPaper)
            .addCalculator('ribbon', calculateRibbon);
    }

    addCalculator(name, fn) {
        this.calculator.addCalculator(name, fn);
        return this;
    }

    loadBoxes() {
        const inputPath = path.join(__dirname, this.inputFile);
        const input = fs.readFileSync(inputPath, 'utf8');
        this.boxes = input
            .trim()
            .split('\n')
            .map(line => Box.fromString(line));
        return this;
    }

    calculateTotals() {
        return this.boxes.reduce((totals, box) => {
            const results = this.calculator.calculateForBox(box);
            for (const [name, value] of Object.entries(results)) {
                totals[name] = (totals[name] || 0) + value;
            }
            return totals;
        }, {});
    }

    solve() {
        this.loadBoxes();
        const totals = this.calculateTotals();

        for (const [material, total] of Object.entries(totals)) {
            const unit = material === 'paper' ? 'square feet' : 'feet';
            console.log(`Total ${material}: ${total} ${unit}`);
        }

        return totals;
    }
}

if (require.main === module) {
    const calculator = new PackagingCalculator('inputs1.txt');
    calculator
        .addCalculator('tape', calculateTape)
        .addCalculator('labels', calculateLabels)
        .solve();
}