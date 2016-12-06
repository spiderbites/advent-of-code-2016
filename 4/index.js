var assert = require('assert')
const fs = require('fs')

const input = fs.readFileSync('input.txt', 'utf8').split('\n')

const getChecksum = (line) => line.match(/\[(.*)]/)[1]
const getSectorId = (line) => parseInt(line.match(/\d+/)[0])
const getChars = (line) => line.split('[')[0].replace(/[^a-z]/g, '')

const getCounts = (chars) => {
  let counts = {}
  Array.from(chars).forEach(c => { counts[c] = (counts[c] || 0) + 1 })
  let countsArray = []
  for (var key in counts) {
    countsArray.push([key, counts[key]])
  }
  return countsArray
}

// [char, num]
const compareCounts = (a, b) => {
  // first compare numbers
  if (a[1] > b[1]) {
    return -1
  } else if (a[1] < b[1]) {
    return 1
  } else if (a[0] > b[0]) {
    return 1
  } else {
    return -1
  }
}

const parseLine = (line) => {
  let room = {}
  room.checksum = getChecksum(line)
  room.sectorId = getSectorId(line)
  room.counts = getCounts(getChars(line)).sort(compareCounts)
  return room
}

const parseInput = (input) => input.map(line => parseLine(line))

const isRealRoom = ({checksum, counts}) => {
  let countsIndex = 0
  let found, j
  for (var i = 0; i < checksum.length; i++) {
    found = false
    j = countsIndex
    while (!found && countsIndex < counts.length) {
      if (counts[countsIndex][0] === checksum[i]) {
        found = true
      }
      countsIndex++
    }
    if (!found) return false
  }
  return true
}

//  is a real room because the most common letters are a (5), b (3), and then a tie between x, y, and z, which are listed alphabetically.
assert(isRealRoom(parseLine('aaaaa-bbb-z-y-x-123[abxyz]')))
// is a real room because although the letters are all tied (1 of each), the first five are listed alphabetically.
assert(isRealRoom(parseLine('a-b-c-d-e-f-g-h-987[abcde]')))
// is a real room.
assert(isRealRoom(parseLine('not-a-real-room-404[oarel]')))
// is not.
assert(!isRealRoom(parseLine('totally-real-room-200[decoy]')))

let total = parseInput(input)
  .filter(room => isRealRoom(room))
  .map(realRoom => realRoom.sectorId)
  .reduce((acc, cur) => acc + cur)

console.log(`the sum of the sector IDs of the real rooms is ${total}`)

// =========
// Part 2
// =========

const shiftChar = (char, shift) => {
  return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97)
}

const encryptedToWords = (line) => line.split(/-\d.*$/)[0].replace(/-/g, ' ')

const caesar = (chars, shift) => {
  return Array.from(chars).map(c => {
    if (c === ' ') return ' '
    return shiftChar(c, shift)
  }).join('')
}

let results = input.map(line => {
  let sectorId = getSectorId(line)
  let decrypted = caesar(encryptedToWords(line), sectorId)
  return [decrypted, sectorId]
}).filter(result => result[0].includes('northpole object storage'))

console.log(results)
