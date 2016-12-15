var _ = require('lodash')

// if chip not connected to its generator and is in same area as another generator, it will be fried
// elevator capacity: can carry at most yourself and two generators or microchips in any combination
// the elevator will only function if it contains at least one generator or microchip.

const MIN_FLOOR = 1
const MAX_FLOOR = 4
const NUM_FLOORS = 4
const TOTAL_ITEMS = 10

let state = {
  _map: [
    [],
    ['OG', 'OM', 'RG', 'RM'],
    ['PM', 'SM'],
    ['TG', 'TM', 'PG', 'SG']
  ],
  elevator: 1
}

const floor = (n) => NUM_FLOORS - n

const chips = floor => floor.filter(e => e[1] === 'M')

const generators = floor => floor.filter(e => e[1] === 'G')

const generatorForChip = (chip, generators) => {
  return generators.filter(g => g[0] === chip[0]).length === 1
}

const valid = (floor) => {
  let cs = chips(floor)
  let gs = generators(floor)
  if (cs.length === 0) return true
  if (gs.length === 0) return true
  for (let c of cs) {
    if (!generatorForChip(c, gs)) {
      return false
    }
  }
  return true
}

const goal = (state) => {
  return state._map[floor(4)].length === TOTAL_ITEMS
}

const upFloor = (curFloor) => {
  if (curFloor + 1 <= MAX_FLOOR) return curFloor + 1
}

const downFloor = (curFloor) => {
  if (curFloor - 1 >= MIN_FLOOR) return curFloor - 1
}

const floorsToMoveTo = (n) => {
  let floors = []
  if ((n + 1) <= MAX_FLOOR) floors.push(n + 1)
  if ((n - 1) >= MIN_FLOOR) floors.push(n - 1)
  return floors
}

// get combinations of items of size 1 or 2
const combinations = (items) => {
  let res = []
  for (var i = 0; i < items.length; i++) {
    res.push([items[i]])
    for (var j = i + 1; j < items.length; j++) {
      res.push([items[i], items[j]])
    }
  }
  return res
}

const validCombinations = (items) => {
  return combinations(items).filter(c => valid(c))
}

const newState = (oldState, nextFloor, moves) => {
  let newState = _.cloneDeep(oldState)
  newState._map[floor(nextFloor)].push(...moves)
  _.pullAll(newState._map[floor(oldState.elevator)], moves)
  newState.elevator = nextFloor
  newState.steps = oldState.steps + 1
  return newState
}

const validNextStates = (state, prevState = {}) => {
  let nextStates = []
  let validMoves = []
  let currentFloor = state._map[floor(state.elevator)]
  let elevatorCombinations = validCombinations(currentFloor)
  let floors = floorsToMoveTo(state.elevator)
  for (let combo of elevatorCombinations) {
    for (let nextFloor of floors) {
      if (valid(state._map[floor(nextFloor)].concat(combo))) {
        validMoves.push({nextFloor, combo})
      }
    }
  }

  // pruning
  // if you can bring two items upstairs, don't bring one item
  let upFloor = Math.max(...floors)
  if (_.find(validMoves, m => m.nextFloor === upFloor && m.combo.length === 2)) {
    _.remove(validMoves, m => m.nextFloor === upFloor && m.combo.length === 1)
  }

  // if you can bring one item downstairs, don't bring two
  let downFloor = Math.min(...floors)
  if (_.find(validMoves, m => m.nextFloor === downFloor && m.combo.length === 1)) {
    _.remove(validMoves, m => m.nextFloor === downFloor && m.combo.length === 2)
  }

  // all pairs are equivalent
  if (validMoves.length > 10) {
    console.log(validMoves)
  }

  // don't put in if matches prevstate...

  for (let move of validMoves) {
    let newS = newState(state, move.nextFloor, move.combo)
    nextStates.push(newS)
  }
  return nextStates
}

const equalStates = (s1, s2) => {
  return _.isEqual(s1._map, s2._map) && _.isEqual(s1.elevator, s2.elevator)
}

// const equivState = (s1, s2) => {

// }

const run = (start) => {
  let frontier = [start]
  let explored = []
  while (true) {
    console.log(`frontier size: ${frontier.length}`)
    console.log(`explored size: ${explored.length}`)
    if (frontier.length === 0) {
      return -1
    }
    let node = frontier.pop()
    if (goal(node)) {
      return node.steps
    }
    explored.push(node)
    validNextStates(node).forEach(n => {
      if (_.findIndex(explored, e => equalStates(e, n)) === -1) {
        let inFrontier = _.findIndex(frontier, e => equalStates(e, n))
        if (inFrontier === -1) {
          frontier.push(n)
          frontier = _.sortBy(frontier, ['steps']).reverse()
        } else if (n.steps < frontier[inFrontier].steps) {
          frontier[inFrontier] = n
        }
      } else {
        // console.log(`already explored`)
      }
    })
  }
}



// procedure UniformCostSearch(Graph, start, goal)
//   node ← start
//   cost ← 0
//   frontier ← priority queue containing node only
//   explored ← empty set
//   do
//     if frontier is empty
//       return failure
//     node ← frontier.pop()
//     if node is goal
//       return solution
//     explored.add(node)
//     for each of node's neighbors n
//       if n is not in explored
//         if n is not in frontier
//           frontier.add(n)
//         else if n is in frontier with higher cost
//           replace existing node with n


// console.log(state)
// console.log(validNextStates(state))
// console.log(validNextStates(state)[1])

run(state)


// console.log(equalStates )