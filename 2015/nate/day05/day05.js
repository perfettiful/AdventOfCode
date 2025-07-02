// A nice string is one with all of the following properties:

// It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
// It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
// It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.
// For example:

// ugknbfddgicrmopn is nice because it has at least three vowels (u...i...o...), a double letter (...dd...), and none of the disallowed substrings.
// aaa is nice because it has at least three vowels and a double letter, even though the letters used by different rules overlap.
// jchzalrnumimnmhp is naughty because it has no double letter.
// haegwjzuvuyypxyu is naughty because it contains the string xy.
// dvszwmarrgswjxmb is naughty because it contains only one vowel.

//ugknbfddgicrmopn === nice
//aaa === nice
//jchzalrnumimnmhp === naughty
//haegwjzuvuyypxyu === naughty
//dvszwmarrgswjxmb === naughty

const fs = require('fs')
const path = require('path')

function check3Vowels(string) {
    let has3Vowels = false

    const vowels = string.match(/[aeiou]/g)

    if (vowels !== null && vowels.length >= 3) {
        has3Vowels = true
    }
    return has3Vowels
}

function checkDoubleLet(string) {
    let hasDouble = false

    string.split('').forEach((letter, index) => {

        if (index < (string.length - 1) && (letter === string.charAt(index + 1))) {
            hasDouble = true
        }

    });

    return hasDouble
}

function forbbidenSubStr(string) {
    let containsForbidden = false

    const forbidden = ['ab', 'cd', 'pq', 'xy']

    forbidden.forEach(item => {

        if (string.includes(item)) {
            containsForbidden = true
        }

    })

    return containsForbidden
}


function checkNice(string) {
    return check3Vowels(string) && checkDoubleLet(string) && !forbbidenSubStr(string)
}

// console.log(
//     '//ugknbfddgicrmopn === nice',
//     checkNice('ugknbfddgicrmopn')
// )

// console.log(
//     '//aaa === nice',
//     checkNice('aaa')
// )

// console.log(
//     'jchzalrnumimnmhp === naughty',
//     checkNice('jchzalrnumimnmhp')
// )

// console.log(
//     'haegwjzuvuyypxyu === naughty',
//     checkNice('haegwjzuvuyypxyu')
// )

// console.log(
//     'dvszwmarrgswjxmb === naughty',
//     checkNice('dvszwmarrgswjxmb')
// )

// function checkNice2(string) {
//     return
// }

// console.log(
//     'jchzalrnumimnmhp === naughty',
//     checkNice('jchzalrnumimnmhp')
// )

// console.log(
//     'haegwjzuvuyypxyu === naughty',
//     checkNice('haegwjzuvuyypxyu')
// )

// console.log(
//     'dvszwmarrgswjxmb === naughty',
//     checkNice('dvszwmarrgswjxmb')
// )

// Part 2

// 1. It contains a pair of any two letters that appears at least twice in the string without overlapping, like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).

// 2. It contains at least one letter which repeats with exactly one letter between them, like xyx, abcdefeghi (efe), or even aaa.

function checkNice2(string) {
    return checkDoubleNoOverlap(string) && checkDoubleLetterBetween(string)
}

function checkDoubleNoOverlap(string){
    for (let i = 0 ; i < string.length - 1; i++){
        const pair = string.charAt(i) + string.charAt(i+1)

        for (let j = i+2; j < string.length - 1; j++) {
            const followingPair = string.charAt(j) + string.charAt(j+1)

            // console.log(pair, followingPair)

            if(pair === followingPair){
                return true
            }
        }
    }
    return false
}

function checkDoubleLetterBetween(string){
    let hasDouble = false

    string.split('').forEach((letter, index) => {

        if (index < (string.length - 1) && (letter === string.charAt(index + 2))) {
            hasDouble = true
        }

    });

    return hasDouble

}

//qjhvhtzxzqqjkmpb is nice because is has a pair that appears twice (qj) and a letter that repeats with exactly one letter between them (zxz).
// xxyxx is nice because it has a pair that appears twice and a letter that repeats with one between, even though the letters used by each rule overlap.
// uurcxstgmygtbstg is naughty because it has a pair (tg) but no repeat with a single letter between them.
// ieodomkazucvgmuy is naughty because it has a repeating letter with one between (odo), but no pair that appears twice.

console.log(
    'qjhvhtzxzqqjkmpb === nice',
    checkNice2('qjhvhtzxzqqjkmpb')
)

console.log(
    'xxyxx === nice',
    checkNice2('xxyxx')
)

console.log(
    'uurcxstgmygtbstg === naughty',
    checkNice2('uurcxstgmygtbstg')
)

console.log(
    'ieodomkazucvgmuy === naughty',
    checkNice2('ieodomkazucvgmuy')
)


function solve() {
    const input = fs.readFileSync("../Inputs/day05.txt", 'utf8')

    const inputArr = input.split('\n')
    const niceWords = inputArr.filter(string => checkNice(string))
    const niceWords2 = inputArr.filter(string => checkNice2(string))

    console.log("Part 1, # of nice strings: ", niceWords.length)
    console.log("Part 2, # of nice strings: ", niceWords2.length)

}

solve()
