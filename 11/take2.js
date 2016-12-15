var _ = require('lodash')

// if chip not connected to its generator and is in same area as another generator, it will be fried
// elevator capacity: can carry at most yourself and two generators or microchips in any combination
// the elevator will only function if it contains at least one generator or microchip.

const MIN_FLOOR = 0
const MAX_FLOOR = 3

let curId = 2

// let pt1start = {
//   id: 0,
//   _map: [
//     [ 'PG', 'SG', 'TG', 'TM' ],
//     ['PM', 'SM'],
//     ['OG', 'OM', 'RG', 'RM'],
//     []
//   ],
//   elevator: 0
// }

// let pt1goal = {
//   id: 1,
//   _map: [
//     [],
//     [],
//     [],
//     [ 'OG', 'OM', 'PG', 'PM', 'RG', 'RM', 'SG', 'SM', 'TG', 'TM' ]
//   ],
//   elevator: 3
// }

let start = {
  id: 0,
  _map: [
    [ 'DG', 'DM', 'EG', 'EM', 'PG', 'SG', 'TG', 'TM' ],
    ['PM', 'SM'],
    ['OG', 'OM', 'RG', 'RM'],
    []
  ],
  elevator: 0
}

let goal = {
  id: 1,
  _map: [
    [],
    [],
    [],
    [ 'DG', 'DM', 'EG', 'EM', 'OG', 'OM', 'PG', 'PM', 'RG', 'RM', 'SG', 'SM', 'TG', 'TM' ]
  ],
  elevator: 3
}

// let testStart = {
//   id: 0,
//   _map: [
//     ['HM', 'LM'],
//     ['HG'],
//     ['LG'],
//     []
//   ],
//   elevator: 0
// }

// let testGoal = {
//   id: 1,
//   _map: [
//     [],
//     [],
//     [],
//     ['HG', 'HM', 'LG', 'LM']
//   ],
//   elevator: 3
// }

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

const getUpFloor = (curFloor) => {
  if (curFloor + 1 <= MAX_FLOOR) return curFloor + 1
}

const getDownFloor = (curFloor) => {
  if (curFloor - 1 >= MIN_FLOOR) return curFloor - 1
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

// get valid combinations of items size 1 or 2 (things can can go together on the elevator)
const validCombinations = (items) => {
  return combinations(items).filter(c => valid(c))
}

const newState = (oldState, nextFloor, items) => {
  let newState = _.cloneDeep(oldState)
  newState.elevator = nextFloor
  newState._map[nextFloor] = newState._map[nextFloor].concat(items).sort()
  newState._map[oldState.elevator] = _.difference(newState._map[oldState.elevator], items).sort()
  newState.id = curId++
  return newState
}

const getNeighbours = (state) => {
  let neighbours = []
  let currentFloor = state._map[state.elevator]
  let elevatorCombinations = validCombinations(currentFloor)

  // Upmoves
  const upFloor = getUpFloor(state.elevator)
  let ups = []
  if (!_.isUndefined(upFloor)) {
    for (let combo of elevatorCombinations) {
      if (valid(state._map[upFloor].concat(combo))) {
        ups.push({floor: upFloor, combo})
        // neighbours.push(newState(state, upFloor, combo))
      }
    }
  }

  // Downmoves
  const downFloor = getDownFloor(state.elevator)
  let downs = []
  if (!_.isUndefined(downFloor)) {
    for (let combo of elevatorCombinations) {
      if (valid(state._map[downFloor].concat(combo))) {
        downs.push({floor: downFloor, combo})
        // neighbours.push(newState(state, downFloor, combo))
      }
    }
  }

  // Pruning
  // if you can bring two items upstairs, don't bring one item
  if (_.find(ups, m => m.combo.length === 2)) {
    _.remove(ups, m => m.combo.length === 1)
  }

  // if you can bring one item downstairs, don't bring two
  if (_.find(downs, m => m.combo.length === 1)) {
    _.remove(downs, m => m.combo.length === 2)
  }

  ups.forEach(u => neighbours.push(newState(state, u.floor, u.combo)))
  downs.forEach(d => neighbours.push(newState(state, d.floor, d.combo)))

  return neighbours
}

const heuristic = (node, goal) => {
  return 10 * node._map[0].length + 5 * node._map[1].length * 2 * node._map[2].length
}

const equalStates = (s1, s2) => {
  return _.isEqual(s1._map, s2._map) && _.isEqual(s1.elevator, s2.elevator)
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
  gScore[start.id] = 0
  // For each node, the total cost of getting from the start node to the goal
  // by passing by that node. That value is partly known, partly heuristic.
  // default val infinity
  let fScore = {}
  // For the first node, that value is completely heuristic.
  fScore[start.id] = heuristic(start, goal)

  while (openSet.length > 0) {
    console.log(`closed set length: ${closedSet.length}`)
    let current = _.minBy(openSet, node => fScore[node.id])
    console.log(`current top floor num: ${current._map[3].length}`)
    if (equalStates(current, goal)) {
      return fScore[current.id] // reconstruct_path(cameFrom, current)
    }
    _.remove(openSet, n => n.id === current.id)
    closedSet.push(current)

    let neighbours = getNeighbours(current)
    for (let neighbour of neighbours) {
      // Ignore the neighbour which is already evaluated.
      if (_.findIndex(closedSet, node => equalStates(node, neighbour)) === -1) {
        let tentativeGScore = gScore[current.id] + 1

        // if neighbour not in open set -> Discover a new node
        let found = _.find(openSet, node => equalStates(node, neighbour))
        if (!found) {
          openSet.push(neighbour)
        } else if (tentativeGScore >= gScore[found]) {
          continue  // This is not a better path.
        }

        // This path is the best until now. Record it!
        cameFrom[neighbour.id] = current.id
        gScore[neighbour.id] = tentativeGScore
        fScore[neighbour.id] = gScore[neighbour.id] + heuristic(neighbour, goal)
      }
    }
  }

  return 'FAIL'
}

console.log(astar(start, goal))
