const crypto = require('crypto');

/**
 * Finds the lowest positive integer that produces an MD5 hash 
 * with a given prefix when appended to a secret key.
 * 
 * @param {string} secret - The secret key to prepend to the number
 * @param {string} prefix - The desired starting string for the hash (e.g., '00000')
 * @returns {number} The lowest integer that satisfies the condition
 */

function mineAdventCoin(secret, prefix) {
    let n = 1;

    while (true) {

        const harshStr = secret + n;
        const hash = crypto.createHash('md5').update(harshStr).digest('hex');

        if (hash.startsWith(prefix)) {
            return n;
        }
        
        n++;
    }
} 

const secret = 'bgvyzdsv';

console.log('Part 1:', mineAdventCoin(secret, '00000'));
console.log('Part 2:', mineAdventCoin(secret, '000000'));

module.exports = { mineAdventCoin }; 