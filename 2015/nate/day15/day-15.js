function parseIngred(input){
    const ingreds = {}

    const cleanInput = input.trim().split('\n')

    for (const ingredLine of cleanInput){
        // ex: Sprinkles: capacity 2, durability 0, flavor -2, texture 0, calories 3
        const ingredParts = ingredLine.split(': ')
        const ingredName = ingredParts[0].trim()
        const ingredProps = ingredParts[1].split(', ')

        ingreds[ingredName] = []

        for(const ingredProp of ingredProps){
            const [prop, value] = ingredProp.split(' ');

            ingreds[ingredName].push([prop, parseInt(value)])

        }
    }

    return ingreds;
}

function calcScore(ingredients, proportions){
// {
//   Sprinkles: 10,
//   Butterscotch: 40,
//   Chocolate: 30,
//   Candy: 20
// }

    let finalScore = 1

    for(let i = 0 ; i < 4; i++){
        let propertyScore = 0
        for(const ingredient in ingredients){

            console.log("\n Scoring for ingred: ", ingredient)
            console.log(parseInt(ingredients[ingredient][i][1]))

            console.log(proportions[ingredient])

            const propertyValue =  parseInt(ingredients[ingredient][i][1])

            propertyScore += propertyValue * proportions[ingredient]

        }
        finalScore *= (propertyScore > 0) ? propertyScore : 0
        console.log({propertyScore})
        console.log({finalScore})
    }
    
    console.log({finalScore})
    return finalScore
}

function solve(){

    const input = `Sprinkles: capacity 2, durability 0, flavor -2, texture 0, calories 3
    Butterscotch: capacity 0, durability 5, flavor -3, texture 0, calories 3
    Chocolate: capacity 0, durability 0, flavor 5, texture -1, calories 8
    Candy: capacity 0, durability -1, flavor 0, texture 5, calories 8`

    const ingreds = parseIngred(input)

    console.log(ingreds)

}

//solve()

const testIngr = {
    Sprinkles: [
      [ 'capacity', '2' ],
      [ 'durability', '0' ],
      [ 'flavor', '-2' ],
      [ 'texture', '0' ],
      [ 'calories', '3' ]
    ],
    Butterscotch: [
      [ 'capacity', '0' ],
      [ 'durability', '5' ],
      [ 'flavor', '-3' ],
      [ 'texture', '0' ],
      [ 'calories', '3' ]
    ],
    Chocolate: [
      [ 'capacity', '0' ],
      [ 'durability', '0' ],
      [ 'flavor', '5' ],
      [ 'texture', '-1' ],
      [ 'calories', '8' ]
    ],
    Candy: [
      [ 'capacity', '0' ],
      [ 'durability', '-1' ],
      [ 'flavor', '0' ],
      [ 'texture', '5' ],
      [ 'calories', '8' ]
    ]
  }

const proportions = {
    Sprinkles: 10,
    Butterscotch: 40,
    Chocolate: 30,
    Candy: 20
  }

const testIngrPrompt = {
    Butterscotch:[['capacity', -1], ['durability', -2], ['flavor', 6], ['texture', 3], ['calories', 8]],
    Cinnamon:[['capacity', 2], ['durability', 3], ['flavor', -2], ['texture', -1], ['calories', 8]]
}

const testPropsPrompt = {
    Butterscotch: 44,
    Cinnamon: 56
}


//calcScore(testIngr, proportions)
calcScore(testIngrPrompt, testPropsPrompt)

