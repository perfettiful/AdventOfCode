const fs = require('fs');

// Count memory characters by parsing escape sequences
function countMemory(line) {
    const content = line.slice(1, -1);
    let count = 0;
    
    for (let i = 0; i < content.length; i++) {

        if (content[i] === '\\') {

            // CASE 1: Valid escape sequences \\ or \"
            if ((content[i + 1] === '\\') || (content[i + 1] === '"')) {
                count++; i++; // Count as 1 char, skip next char
            } 

            // CASE 2: Hex escape sequence \x followed by 2 hex digits
            else if ((content[i + 1] === 'x') && (i + 3 < content.length)) {
                count++; i += 3; // Count as 1 char, skip next 3 chars (\x27)
            } 
            
            // CASE 3: Invalid escape sequence, treat backslash as literal
            else {
                count++;
            }
            
        } else {
            // CASE 4: Regular character, count as 1
            count++;
        }
    }
    
    return count;
}

// Count encoded characters (re-escaped)
function countEncoded(line) {
    return 2 + line.split('').reduce((sum, c) => 
        sum + ((c === '\\') || (c === '"') ? 2 : 1), 0);
    //     ^   ^                                    ^
    //     |   |                                    |
    //     |   |                                    +-- Default case: regular char = 1
    //     |   |                                    |
    //     |   |                                    +-- Special chars (\ or ") = 2 (escaped)
    //     |   |                                    |
    //     |   +-- Reduce through each character    +-- Ternary: escape special chars
    //     |                                        |
    //     +-- Start with 2 for outer quotes       +-- Check if char is \ or "
}

// Solve both parts
function solve(lines) {
    let part1 = 0, part2 = 0;
    
    for (const line of lines) {
        const code = line.length;
        const memory = countMemory(line);
        const encoded = countEncoded(line);
        
        part1 += code - memory;
        part2 += encoded - code;
    }
    
    return [part1, part2];
}

// Run
const input = fs.readFileSync('../Inputs/day08.txt', 'utf8').trim().split('\n');
const [p1, p2] = solve(input);
console.log(`Part 1: ${p1}`);
console.log(`Part 2: ${p2}`); 