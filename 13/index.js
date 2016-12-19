var _ = require('lodash')

// Find x*x + 3*x + 2*x*y + y + y*y.
// Add the office designer's favorite number (your puzzle input).
// Find the binary representation of that sum; count the number of bits that are 1.
// If the number of bits that are 1 is even, it's an open space.
// If the number of bits that are 1 is odd, it's a wall.

// const INPUT = 10
const INPUT = 1362
const SPACE = '.'
const WALL = '#'
const START = [1, 1]
// const GOAL = [7, 4]
const GOAL = [31, 39]

const numBinaryOneBits = (x) => {
  if (x === 0) return 0
  if (x === 1) return 1
  let res = 0
  while (x > 0) {
    res += x % 2
    x = Math.floor(x / 2)
  }
  return res
}

const isSpace = (x, y) => {
  let result = (x * x + 3 * x + 2 * x * y + y + y * y) + INPUT
  return numBinaryOneBits(result) % 2 === 0
}

const print = (maxX, maxY) => {
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      process.stdout.write(isSpace(x, y) ? SPACE : WALL)
    }
    process.stdout.write('\n')
  }
}

const heuristic = (start, goal) => {
  return Math.abs(goal[0] - start[0]) + Math.abs(goal[1] - start[1])
}

const id = (array) => {
  return array.join('')
}

const equals = (x, y) => {
  return _.isEqual(x, y)
}

const getNeighbours = ([x, y]) => {
  let potentialNeighbours = [[x, y + 1], [x + 1, y]]
  if (x > 0) potentialNeighbours.push([x - 1, y])
  if (y > 0) potentialNeighbours.push([x, y - 1])
  return potentialNeighbours.filter(n => isSpace(...n))
}

const totalLocations = (start, steps) => {
  let totalLocations = new Map()
  totalLocations.set(id(start), start)
  let last = new Map()
  last.set(id(start), start)
  for (let s = 1; s <= steps; s++) {
    let newLast = new Map()
    for (let location of last.values()) {
      let neighbours = getNeighbours(location)
      for (let n of neighbours) {
        newLast.set(id(n), n)
        totalLocations.set(id(n), n)
      }
    }
    last = newLast
  }
  return totalLocations.size
}

const astar = (start, goal) => {
  // The set of nodes already evaluated.
  let closedSet = []
  // The set of currently discovered nodes still to be evaluated.
  // Initially, only the start node is known.
  let openSet = [start]
  // For each node, which node it can most efficiently be reached from.
  // If a node can be reached from many nodes, cameFrom will eventually contain the
  // most efficient previous step.
  let cameFrom = {}

  // For each node, the cost of getting from the start node to that node.
  // default val infinity
  let gScore = {}
  // The cost of going from start to start is zero.
  gScore[id(start)] = 0
  // For each node, the total cost of getting from the start node to the goal
  // by passing by that node. That value is partly known, partly heuristic.
  // default val infinity
  let fScore = {}
  // For the first node, that value is completely heuristic.
  fScore[id(start)] = heuristic(start, goal)

  while (openSet.length > 0) {
    let current = _.minBy(openSet, node => fScore[id(node)])
    if (equals(current, goal)) {
      return fScore[id(current)] // reconstruct_path(cameFrom, current)
    }
    _.remove(openSet, n => id(n) === id(current))
    closedSet.push(current)

    let neighbours = getNeighbours(current)
    for (let neighbour of neighbours) {
      // Ignore the neighbour which is already evaluated.
      if (_.findIndex(closedSet, node => equals(node, neighbour)) === -1) {
        let tentativeGScore = gScore[id(current)] + 1

        // if neighbour not in open set -> Discover a new node
        let found = _.find(openSet, node => equals(node, neighbour))
        if (!found) {
          openSet.push(neighbour)
        } else if (tentativeGScore >= gScore[found]) {
          continue  // This is not a better path.
        }

        // This path is the best until now. Record it!
        cameFrom[id(neighbour)] = id(current)
        gScore[id(neighbour)] = tentativeGScore
        fScore[id(neighbour)] = gScore[id(neighbour)] + heuristic(neighbour, goal)
      }
    }
  }

  return 'FAIL'
}

// print(10, 7)

console.log(`Fewest # of steps to reach goal: ${astar(START, GOAL)}`)
console.log(`Total reachable locations in 50 steps: ${totalLocations([1, 1], 50)}`)


