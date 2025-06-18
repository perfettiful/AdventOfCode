// > delivers presents to 2 houses: one at the starting location, and one to the east.
// ^>v< delivers presents to 4 houses in a square, including twice to the house at his starting/ending location.
// ^v^v^v^v^v delivers a bunch of presents to some very lucky children at only 2 houses.

//How many unique cells in a grid do we visit with a path
// > =2
// ^>v< = 4
// ^v^v^v^v^v = 2

const fs = require("fs")

const inputPath = fs.readFileSync('./Inputs/day03.txt', 'utf8')

function part1(inputPathArg) {

    const visitedPos = new Set(["0,0"]);

    let xPos = 0;
    let yPos = 0;

    for (const move of inputPathArg) {

        if (move === "^") {
            yPos++;
        } else if (move === ">") {
            xPos++;
        } else if (move === "v") {
            yPos--;
        } else if (move === "<") {
            xPos--;
        }

        visitedPos.add(`${xPos},${yPos}`);
        // visitedPos == ['0,0', '1,0']

        // console.log("visited: ", visitedPos

    }

    console.log("This many houses were visited once: ", visitedPos.size);
}

// part1(inputPath)
// main(">")
// main("^>v<")
// main("^v^v^v^v^v")

function part2(inputPathArg) {

    const visitedPos = new Set(["0,0"]);

    let xPosA = 0;
    let yPosA = 0;

    let xPosB = 0;
    let yPosB = 0;

    let isSantasTurn = true;

    for (const move of inputPathArg) {
        
        if (move === "^") {
            if (isSantasTurn) {
                yPosA++
            } else {
                yPosB++;
            }

        } else if (move === ">") {

            if (isSantasTurn) {
                xPosA++
            } else {
                xPosB++;
            }

        } else if (move === "v") {

            if (isSantasTurn) {
                yPosA--
            } else {
                yPosB--
            }

        } else if (move === "<") {

            if (isSantasTurn) {
                xPosA--
            } else {
                xPosB--
            }
        }

        if (isSantasTurn) {
            visitedPos.add(`${xPosA},${yPosA}`);
        } else {
            visitedPos.add(`${xPosB},${yPosB}`);
        }
        isSantasTurn = !isSantasTurn;
    }

    console.log("This many houses were visited once: ", visitedPos.size);
}

// ^v delivers presents to 3 houses, because Santa goes north, and then Robo-Santa goes south.
// ^>v< now delivers presents to 3 houses, and Santa and Robo-Santa end up back where they started.
// ^v^v^v^v^v now delivers presents to 11 houses, with Santa going one direction and Robo-Santa going the other.

// ^v = 3
// ^>v< = 3
// ^v^v^v^v^v = 11

part2(inputPath)
// part2("^v")
// part2("^>v<")
// part2("^v^v^v^v^v")