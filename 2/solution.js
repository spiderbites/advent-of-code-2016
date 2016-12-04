const fs = require('fs')

const testFile = fs.readFileSync('./test.txt', 'utf8').split('\n')
const input = fs.readFileSync('input.txt', 'utf8').split('\n')

const grid = [
  [1,2,3],
  [4,5,6],
  [7,8,9]
]

let initPos = {
  x: 1,
  y: 1
}

const move = ({x, y}, movement) => {
  if (movement === 'U') {
    return {x, y: Math.max(0, y - 1)}
  } else if (movement === 'D') {
    return {x, y: Math.min(2, y + 1)}
  } else if (movement === 'L') {
    return {x: Math.max(0, x - 1), y}
  } else if (movement === 'R') {
    return {x: Math.min(2, x + 1), y}
  }
}

const run = (input, positions) => {
  let code = []
  for (var line of input) {
    for (var movement of line) {
      positions = move(positions, movement)
    }
    code.push(grid[positions.y][positions.x])
  }
  return code.join('')
}

console.log(run(input, initPos))
