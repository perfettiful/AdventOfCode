const input = `33
14
18
20
45
35
16
35
1
13
18
13
50
44
48
6
24
41
30
42`

const containerSizes = input.trim().split('\n').map(Number)
const targetVolume = 150;

function solve(containerSizes, targetVolume){

    let validCount1 = 0;
    let validCount2 = 0;
    const totalSizes = containerSizes.length;
    const totalCombos = Math.pow(2, totalSizes);
    

    console.log("Problem size: ",{totalSizes}, {targetVolume}, {totalCombos})

    const allCombos = [];
    let minContainersUsed = totalSizes +1

    for(let comboNum = 0; comboNum < totalCombos; comboNum++){

        const bitMap = decimalToBinary(comboNum,totalSizes)
        let comboTotal = 0;
        let containersUsed = 0


        for(let i = 0; i < bitMap.length; i++){


            if(parseInt(bitMap.charAt(i)) === 1 ){

                containersUsed++
                
                comboTotal += containerSizes[i]
            }

        }

        if(comboTotal === targetVolume){

            if(containersUsed < minContainersUsed){
                minContainersUsed = containersUsed
            }

            validCount1++;

        }

    }

    for(let comboNum = 0; comboNum < totalCombos; comboNum++){

        const bitMap = decimalToBinary(comboNum,totalSizes)
        let comboTotal = 0;
        let containersUsed = 0


        for(let i = 0; i < bitMap.length; i++){


            if(parseInt(bitMap.charAt(i)) === 1 ){

                containersUsed++
                
                comboTotal += containerSizes[i]
            }

        }

        if((comboTotal === targetVolume) & (minContainersUsed == containersUsed)){

            validCount2++;

        }

    }

    
    return [validCount1, validCount2, minContainersUsed];
}

function decimalToBinary(decimalNumber, bitLen) {
    let binStr = decimalNumber.toString(2)
    return binStr.padStart(bitLen, "0")
}

const [validCount1, validCount2, minContainersUsed] = solve(containerSizes, targetVolume)

console.log("Final Soln Part 2: ", validCount1, validCount2, minContainersUsed)

// const [validCount, minContainersUsed] = solve([20, 15, 10, 5, 5], 25)

// console.log("Test Soln: ", validCount, minContainersUsed)


