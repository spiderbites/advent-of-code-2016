const fs = require('fs')

const input = fs.readFileSync('./input2.txt', 'utf8').split('\n')

const line = /Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)\./

class Disc {
  constructor (number, positions, startPosition) {
    this.number = number
    this.positions = positions
    this.startPosition = startPosition
  }
}

const getDiscs = (input) => {
  let discs = []
  input.forEach(i => {
    const [, number, positions, startPosition] = line.exec(i)
    discs.push(new Disc(+number, +positions, +startPosition))
  })
  return discs
}

const getPositionAtTime = (disc, time, index) => {
  return (disc.startPosition + time + index + 1) % disc.positions
}

const sum = arr => arr.reduce((a, c) => a + c)

const findTime = (discs) => {
  let time = 0
  while (true) {
    let positions = discs.map((d, index) => getPositionAtTime(d, time, index))
    console.log(`time ${time}, positions: ${positions}`)
    if (sum(positions) === 0) return true
    time++
  }
}

let discs = getDiscs(input)
findTime(discs)
