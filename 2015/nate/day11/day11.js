function isValid(password) {

    if (password.includes('i') || password.includes('o') || password.includes('l')) {
        return false
    }

    let hasStraight = false
    for (let i = 0; i < password.length - 2; i++) {
        if (
            password.charCodeAt(i) + 1 === password.charCodeAt(i + 1) && 
            password.charCodeAt(i + 1) + 1 === password.charCodeAt(i + 2)
            ) {
            hasStraight = true
            break
        }
    }
    if (!hasStraight) return false
    

    let pairs = 0
    let usedPositions = new Set()
    
    for (let i = 0; i < password.length - 1; i++) {
        if (
            password[i] === password[i + 1] && !usedPositions.has(i) && !usedPositions.has(i + 1)
            ) {
            pairs++
            usedPositions.add(i)
            usedPositions.add(i + 1)
        }
    }
    
    return pairs >= 2
}

function incrementPw(password) {
    let chars = password.split('')
    
    for (let i = chars.length - 1; i >= 0; i--) {
        if (chars[i] === 'z') {
            chars[i] = 'a'
        } else {
            chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1)
            break
        }
    }
    
    return chars.join('')
}

function solve(currentPassword) {
    let newPassword = currentPassword
    
    do {
        newPassword = incrementPw(newPassword)
    } while (!isValid(newPassword))
    
    console.log("Next password:", newPassword)
    return newPassword
}


const result = solve("hxbxwxba")
console.log("Answer:", result)