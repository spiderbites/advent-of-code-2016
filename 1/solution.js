const input = 'R1, R3, L2, L5, L2, L1, R3, L4, R2, L2, L4, R2, L1, R1, L2, R3, L1, L4, R2, L5, R3, R4, L1, R2, L1, R3, L4, R5, L4, L5, R5, L3, R2, L3, L3, R1, R3, L4, R2, R5, L4, R1, L1, L1, R5, L2, R1, L2, R188, L5, L3, R5, R1, L2, L4, R3, R5, L3, R3, R45, L4, R4, R72, R2, R3, L1, R1, L1, L1, R192, L1, L1, L1, L4, R1, L2, L5, L3, R5, L3, R3, L4, L3, R1, R4, L2, R2, R3, L5, R3, L1, R1, R4, L2, L3, R1, R3, L4, L3, L4, L2, L2, R1, R3, L5, L1, R4, R2, L4, L1, R3, R3, R1, L5, L2, R4, R4, R2, R1, R5, R5, L4, L1, R5, R3, R4, R5, R3, L1, L2, L4, R1, R4, R5, L2, L3, R4, L4, R2, L2, L4, L2, R5, R1, R4, R3, R5, L4, L4, L5, L5, R3, R4, L1, L3, R2, L2, R1, L3, L5, R5, R5, R3, L4, L2, R4, R5, R1, R4, L3'.split(', ')

const testInput = 'R5, L5, R5, R3'.split(', ')

// E -> x + 1
// W -> x - 1
// N -> y + 1
// S -> y - 1

let initPos = {
  x: 0,
  y: 0,
  facing: 'N'
}

const move = ({x, y, facing}, movement) => {
  const direction = movement[0]
  const steps = parseInt(movement.slice(1))
  if (facing === 'N') {
    if (direction === 'R') {
      return { x: x + steps, y, facing: 'E' }
    } else {
      return { x: x - steps, y, facing: 'W' }
    }    
  } else if (facing === 'S') {
    if (direction === 'R') {
      return { x: x - steps, y, facing: 'W' }
    } else {
      return { x: x + steps, y, facing: 'E' }
    }
  } else if (facing === 'E') {
    if (direction === 'R') {
      return { x, y: y - steps, facing: 'S' }
    } else {
      return { x, y: y + steps, facing: 'N' }
    }
  } else if (facing === 'W') {
    if (direction === 'R') {
      return { x, y: y + steps, facing: 'N' }
    } else {
      return { x, y: y - steps, facing: 'S' }
    }
  }
}

const run = (input, positions) => {
  for (var i of input) {
    positions = move(positions, i)
  }
  console.log(`Blocks away: ${Math.abs(positions.x) + Math.abs(positions.y)}`)
  return positions
}

console.log(run(input, initPos))
