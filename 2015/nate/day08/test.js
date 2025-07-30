const { countCodeCharacters, countMemoryCharacters, countEncodedCharacters } = require('./day08');

// Test cases from the problem description
const testCases = [
    '""',           // 2 code chars, 0 memory chars
    '"abc"',        // 5 code chars, 3 memory chars  
    '"aaa\\"aaa"',  // 10 code chars, 7 memory chars
    '"\\x27"'       // 6 code chars, 1 memory char
];

console.log('=== Day 8 Test Cases ===\n');

let totalCodeChars = 0;
let totalMemoryChars = 0;
let totalEncodedChars = 0;

for (const testCase of testCases) {
    const codeChars = countCodeCharacters(testCase);
    const memoryChars = countMemoryCharacters(testCase);
    const encodedChars = countEncodedCharacters(testCase);
    
    console.log(`"${testCase}"`);
    console.log(`  Code: ${codeChars} chars`);
    console.log(`  Memory: ${memoryChars} chars`);
    console.log(`  Encoded: ${encodedChars} chars`);
    console.log(`  Part 1 diff: ${codeChars - memoryChars}`);
    console.log(`  Part 2 diff: ${encodedChars - codeChars}`);
    console.log('');
    
    totalCodeChars += codeChars;
    totalMemoryChars += memoryChars;
    totalEncodedChars += encodedChars;
}

console.log('=== Totals ===');
console.log(`Total code characters: ${totalCodeChars}`);
console.log(`Total memory characters: ${totalMemoryChars}`);
console.log(`Total encoded characters: ${totalEncodedChars}`);
console.log(`Part 1 Answer: ${totalCodeChars - totalMemoryChars} (expected: 12)`);
console.log(`Part 2 Answer: ${totalEncodedChars - totalCodeChars} (expected: 19)`);

// Verify expected results
const expectedPart1 = 12;
const expectedPart2 = 19;
const actualPart1 = totalCodeChars - totalMemoryChars;
const actualPart2 = totalEncodedChars - totalCodeChars;

console.log('\n=== Verification ===');
console.log(`Part 1: ${actualPart1 === expectedPart1 ? '✅ PASS' : '❌ FAIL'} (${actualPart1} vs ${expectedPart1})`);
console.log(`Part 2: ${actualPart2 === expectedPart2 ? '✅ PASS' : '❌ FAIL'} (${actualPart2} vs ${expectedPart2})`); 