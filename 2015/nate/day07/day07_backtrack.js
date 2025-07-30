const fs = require('fs');
const path = require('path');

class CircuitSimulator {
    constructor() {
        this.wires = new Map(); // wire -> signal value
        this.instructions = new Map(); // wire -> instruction that sets it
        this.memo = new Map(); // wire -> cached signal value
    }

    /**
     * Parses a single instruction line
     * @param {string} line - Input line
     * @returns {object} Parsed instruction object
     */
    parseInstruction(line) {
        const parts = line.trim().split(' -> ');
        const output = parts[1];
        const input = parts[0];

        // Direct assignment: "123 -> x"
        if (/^\d+$/.test(input)) {
            return {
                type: 'ASSIGN',
                value: parseInt(input),
                output: output
            };
        }

        // NOT operation: "NOT x -> h"
        if (input.startsWith('NOT ')) {
            return {
                type: 'NOT',
                operand: input.substring(4),
                output: output
            };
        }

        // Binary operations: "x AND y -> d", "x OR y -> e", "x LSHIFT 2 -> f", "y RSHIFT 2 -> g"
        const binaryMatch = input.match(/^(.+?) (AND|OR|LSHIFT|RSHIFT) (.+)$/);
        if (binaryMatch) {
            return {
                type: binaryMatch[2],
                left: binaryMatch[1],
                right: binaryMatch[3],
                output: output
            };
        }

        // Wire to wire: "lx -> a"
        return {
            type: 'WIRE',
            input: input,
            output: output
        };
    }

    /**
     * Checks if a string is a number
     * @param {string} str - String to check
     * @returns {boolean} True if number
     */
    isNumber(str) {
        return /^\d+$/.test(str);
    }

    /**
     * Loads instructions and builds dependency map
     * @param {string[]} lines - Input lines
     * @param {string} skipWire - Wire to skip assignments for (for Part 2)
     */
    loadInstructions(lines, skipWire = null) {
        for (const line of lines) {
            const instruction = this.parseInstruction(line);
            
            // For Part 2, skip instructions that assign to the specified wire
            if (skipWire && instruction.type === 'ASSIGN' && instruction.output === skipWire) {
                continue;
            }
            
            this.instructions.set(instruction.output, instruction);
        }
    }

    /**
     * Recursively resolves a wire's signal value
     * @param {string} wire - Wire name or number
     * @returns {number} Signal value
     */
    resolveWire(wire) {
        // Start base cases...
        // Check memoization cache first
        if (this.memo.has(wire)) {
            return this.memo.get(wire);
        }

        // If it's a number, return it directly
        if (this.isNumber(wire)) {
            return parseInt(wire);
        }

        // If wire already has a signal, return it
        if (this.wires.has(wire)) {
            return this.wires.get(wire);
        }
        // ... End base cases


        //Start recursive call
        // Get the instruction that sets this wire
        const instruction = this.instructions.get(wire);
        if (!instruction) {
            throw new Error(`No instruction found for wire '${wire}'`);
        }

        // Recursively resolve the instruction
        let result = this.executeInstruction(instruction);
        
        // Cache the result
        this.memo.set(wire, result);
        this.wires.set(wire, result);
        
        return result;
    }

    /**
     * Executes an instruction by resolving its dependencies
     * @param {object} instruction - Instruction object
     * @returns {number} Result signal value
     */
    executeInstruction(instruction) {
        let result;

        switch (instruction.type) {
            case 'ASSIGN':
                result = instruction.value;
                break;
                
            case 'NOT':
                const operandValue = this.resolveWire(instruction.operand);
                result = ~operandValue;
                break;
                
            case 'AND':
                const leftValue = this.resolveWire(instruction.left);
                const rightValue = this.resolveWire(instruction.right);
                result = leftValue & rightValue;
                break;
                
            case 'OR':
                const leftOrValue = this.resolveWire(instruction.left);
                const rightOrValue = this.resolveWire(instruction.right);
                result = leftOrValue | rightOrValue;
                break;
                
            case 'LSHIFT':
                const leftShiftValue = this.resolveWire(instruction.left);
                const shiftAmount = parseInt(instruction.right);
                result = leftShiftValue << shiftAmount;
                break;
                
            case 'RSHIFT':
                const rightShiftValue = this.resolveWire(instruction.left);
                const rshiftAmount = parseInt(instruction.right);
                result = rightShiftValue >> rshiftAmount;
                break;
                
            case 'WIRE':
                result = this.resolveWire(instruction.input);
                break;
                
            default:
                throw new Error(`Unknown instruction type: ${instruction.type}`);
        }

        // Ensure 16-bit signal (0 to 65535)
        result = result & 0xFFFF;
        return result;
    }

    /**
     * Gets the signal for a specific wire using backtracking
     * @param {string} wire - Wire name
     * @returns {number} Signal value
     */
    getWireSignal(wire) {
        return this.resolveWire(wire);
    }

    /**
     * Resets the circuit for Part 2
     */
    reset() {
        this.wires.clear();
        this.memo.clear();
    }

    /**
     * Sets a specific wire to a value (for Part 2 override)
     * @param {string} wire - Wire name
     * @param {number} value - Signal value
     */
    setWire(wire, value) {
        const signal = value & 0xFFFF;
        this.wires.set(wire, signal);
        this.memo.set(wire, signal);
    }
}

function solvePart1() {
    try {
        // Read input file
        const inputPath = path.join(__dirname, '../Inputs/day07.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        const lines = input.trim().split('\n');

        // Create circuit simulator
        const circuit = new CircuitSimulator();
        circuit.loadInstructions(lines);
        
        // Get signal on wire 'a' using backtracking
        const signalA = circuit.getWireSignal('a');
        console.log(`Part 1 signal on wire 'a': ${signalA}`);
        
        return signalA;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

function solvePart2() {
    try {
        // Read input file
        const inputPath = path.join(__dirname, '../Inputs/day07.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        const lines = input.trim().split('\n');

        // Create circuit simulator for Part 1
        const circuit = new CircuitSimulator();
        circuit.loadInstructions(lines);
        
        // First, get Part 1 signal
        const part1SignalA = circuit.getWireSignal('a');
        console.log(`Part 1 signal on wire 'a': ${part1SignalA}`);

        // Create new circuit for Part 2 (skip wire 'b' assignment)
        const circuit2 = new CircuitSimulator();
        circuit2.loadInstructions(lines, 'b');
        
        // Override wire 'b' with Part 1 signal
        circuit2.setWire('b', part1SignalA);
        console.log(`Set wire 'b' to ${part1SignalA} for Part 2`);

        // Get new signal on wire 'a'
        const part2SignalA = circuit2.getWireSignal('a');
        console.log(`Part 2 signal on wire 'a': ${part2SignalA}`);
        
        return part2SignalA;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

// Run both parts
if (require.main === module) {
    console.log("=== Part 1 ===");
    solvePart1();
    
    console.log("\n=== Part 2 ===");
    solvePart2();
}

module.exports = { solvePart1, solvePart2 }; 