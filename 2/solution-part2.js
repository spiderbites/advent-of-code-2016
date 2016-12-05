const fs = require('fs')

const testFile = fs.readFileSync('./test.txt', 'utf8').split('\n')
const input = fs.readFileSync('input.txt', 'utf8').split('\n')

const grid = [
  ['-', '-', 1, '-', '-'],
  ['-', 2, 3, 4, '-'],
  [5, 6, 7, 8, 9],
  ['-', 'A', 'B', 'C', '-'],
  ['-', '-', 'D', '-', '-']
]

const MAX_X = 4
const MAX_Y = 4

let initPos = {
  x: 0,
  y: 2
}

const move = ({x,y}, movement) => {
  let newPos
  if (movement === 'U') {
    newPos = {x, y: Math.max(0, y - 1)}
  } else if (movement === 'D') {
    newPos = {x, y: Math.min(MAX_Y, y + 1)}
  } else if (movement === 'L') {
    newPos = {x: Math.max(0, x - 1), y}
  } else if (movement === 'R') {
    newPos = {x: Math.min(MAX_X, x + 1), y}
  }
  return (grid[newPos.x][newPos.y] === '-') ? {x, y} : newPos
}

const run = (input, position) => {
  let code = []
  for (var line of input) {
    for (var movement of line) {
      position = move(position, movement)
    }
    code.push(grid[position.y][position.x])
  }
  return code.join('')
}

console.log(run(input, initPos))
