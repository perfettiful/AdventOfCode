function lookAndSay(sequence) {
    let result = '';
    let count = 1;
    let currentDigit = sequence[0];
    
    for (let i = 1; i < sequence.length; i++) {
        if (sequence[i] === currentDigit) {
            count++;
        } else {
            result += count + currentDigit;
            count = 1;
            currentDigit = sequence[i];
        }
    }
    
    result += count + currentDigit;
    
    return result;
}

function solveLookAndSay(initialSequence, iterations) {
    let current = initialSequence;
    
    for (let i = 0; i < iterations; i++) {
        current = lookAndSay(current);
    }
    
    return current.length;
}

function testExamples() {
    console.log("=== Testing Look-and-Say Examples ===");
    
    const examples = [
        { input: "1", expected: "11" },
        { input: "11", expected: "21" },
        { input: "21", expected: "1211" },
        { input: "1211", expected: "111221" },
        { input: "111221", expected: "312211" }
    ];
    
    examples.forEach(({ input, expected }) => {
        const result = lookAndSay(input);
        const passed = result === expected;
        console.log(`${input} -> ${result} (expected: ${expected}) ${passed ? '✅' : '❌'}`);
    });
}

function solve(iterations) {
    const initialSequence = "1113222113";
    
    console.log("\n=== Part 1: Look-and-Say Sequence ===");
    console.log(`Initial sequence: ${initialSequence}`);
    console.log(`Iterations: ${iterations}`);
    
    const startTime = performance.now();
    const finalLength = solveLookAndSay(initialSequence, iterations);
    const endTime = performance.now();
    
    console.log(`Final sequence length: ${finalLength}`);
    console.log(`Execution time: ${(endTime - startTime).toFixed(2)}ms`);
    
    return finalLength;
}


if (require.main === module) {
    testExamples();
    solve(40);
    solve(50);
}

module.exports = { lookAndSay, solveLookAndSay }; 