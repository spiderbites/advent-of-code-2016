const md5 = require('md5')

const WIDTH = 4
const HEIGHT = 4
const GOAL = [3, 3]

const INPUT = 'vwbaicqe'

const START = {
  position: [0, 0],
  path: INPUT
}

function getOpenDoors (string) {
  const openTest = /[bcdef]/
  const hash = md5(string).slice(0, 4).split('')
  return hash.map(char => openTest.test(char))
}

function getMoves (string, position) {
  const openDoors = getOpenDoors(string)
  let moves = new Map()
  // up
  if (position[1] > 0 && openDoors[0]) {
    moves.set('U', [position[0], position[1] - 1])
  }
  // down
  if (position[1] < HEIGHT - 1 && openDoors[1]) {
    moves.set('D', [position[0], position[1] + 1])
  }
  // left
  if (position[0] > 0 && openDoors[2]) {
    moves.set('L', [position[0] - 1, position[1]])
  }
  // right
  if (position[0] < WIDTH - 1 && openDoors[3]) {
    moves.set('R', [position[0] + 1, position[1]])
  }
  return moves
}

const equalPos = (a, b) => {
  return a[0] === b[0] && a[1] === b[1]
}

const findMin = (nodes) => {
  let index = 0
  let node = nodes[0]
  for (let i = 1; i < nodes.length; i++) {
    if (nodes[i].path.length < nodes[index].path.length) {
      index = i
      node = nodes[i]
    }
  }
  return { index, node }
}

const search = (start, goal) => {
  let openSet = [start]
  const inputLength = start.path.length

  while (openSet.length > 0) {
    let {index, node: current} = findMin(openSet, (a, b) => a < b)
    if (equalPos(current.position, goal)) {
      return current.path.slice(inputLength)
    }
    openSet.splice(index, 1)
    let moves = getMoves(current.path, current.position)
    moves.forEach((position, direction) => {
      openSet.push({
        position,
        path: current.path + direction
      })
    })
  }

  return 'FAIL'
}

const searchMax = (start, goal) => {
  let openSet = [start]
  const inputLength = start.path.length
  let lengths = []

  while (openSet.length > 0) {
    let {index, node: current} = findMin(openSet, (a, b) => a < b)
    openSet.splice(index, 1)
    if (equalPos(current.position, goal)) {
      lengths.push(current.path.length - inputLength)
    } else {
      let moves = getMoves(current.path, current.position)
      moves.forEach((position, direction) => {
        openSet.push({
          position,
          path: current.path + direction
        })
      })
    }
  }
  return Math.max(...lengths)
}

console.log(search(START, GOAL))
console.log(searchMax(START, GOAL))
