const fs = require('fs')

const input = fs.readFileSync('input.txt', 'utf8').split(', ')

// E -> x + 1
// W -> x - 1
// N -> y + 1
// S -> y - 1

let initPos = {
  x: 0,
  y: 0,
  facing: 'N'
}

let seen = {
  '00': 1
}

let repeats = []

const east = ({x, y}) => ({x: x + 1, y})
const west = ({x, y}) => ({x: x - 1, y})
const north = ({x, y}) => ({x, y: y + 1})
const south = ({x, y}) => ({x, y: y - 1})

const move = ({x, y, facing}, movement) => {
  const direction = movement[0]
  const steps = parseInt(movement.slice(1))
  if (facing === 'N') {
    if (direction === 'R') {
      return Object.assign({}, doSteps(x, y, steps, east), {facing: 'E'})
    } else {
      return Object.assign({}, doSteps(x, y, steps, west), {facing: 'W'})
    }    
  } else if (facing === 'S') {
    if (direction === 'R') {
      return Object.assign({}, doSteps(x, y, steps, west), {facing: 'W'})
    } else {
      return Object.assign({}, doSteps(x, y, steps, east), {facing: 'E'})
    }
  } else if (facing === 'E') {
    if (direction === 'R') {
      return Object.assign({}, doSteps(x, y, steps, south), {facing: 'S'})
    } else {
      return Object.assign({}, doSteps(x, y, steps, north), {facing: 'N'})
    }
  } else if (facing === 'W') {
    if (direction === 'R') {
      return Object.assign({}, doSteps(x, y, steps, north), {facing: 'N'})
    } else {
      return Object.assign({}, doSteps(x, y, steps, south), {facing: 'S'})
    }
  }
}

const doSteps = (x, y, steps, stepFunc) => {
  let position = {x, y}
  while (steps > 0) {
    steps -= 1
    position = stepFunc(position)
    trackPositions(position)
  }
  return position
}

const trackPositions = ({x, y}) => {
  let key = `${x}${y}`
  if (seen[key]) {
    repeats.push([x, y])
    seen[key] += 1
  } else {
    seen[key] = 1
  }
}

const run = (input, position) => {
  input.forEach((movement, index) => {
    position = move(position, movement)
  })
  console.log(`Blocks away: ${Math.abs(position.x) + Math.abs(position.y)}`)
  console.log(`First repeat: ${repeats[0]}, ${Math.abs(repeats[0][0]) + Math.abs(repeats[0][1])} blocks away`)
  return position
}

run(input, initPos)
