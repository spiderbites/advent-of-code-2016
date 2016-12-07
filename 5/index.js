var md5 = require('md5')

const testInput = 'abc'
const input = 'ffykfhsq'

const PW_LEN = 8
const NUM_ZEROES = 5

const fiveZeroHash = str => ('0x' + md5(str).slice(0, NUM_ZEROES) ^ 0) === 0

const findNextChar = (str, counter) => {
  while (!fiveZeroHash(str + (++counter))) {
    if (counter % 10000 === 0) process.stdout.write('.')
  }
  let hash = md5(str + counter)
  process.stdout.write(`${hash[NUM_ZEROES]}/${hash[NUM_ZEROES + 1]}`)
  return { hash, counter }
}

const run = (input) => {
  let password = []
  let counter = 0
  while (password.length < PW_LEN) {
    let result = findNextChar(input, counter)
    password.push(result.hash[NUM_ZEROES])
    counter = result.counter
  }
  return password.join('')
}

const runPt2 = (input) => {
  let password = ['_', '_', '_', '_', '_', '_', '_', '_']
  let counter = 0
  while (password.includes('_')) {
    let result = findNextChar(input, counter)
    let position = result.hash[NUM_ZEROES]
    let char = result.hash[NUM_ZEROES + 1]
    if (position < PW_LEN && password[position] === '_') {
      password[position] = char
    }
    counter = result.counter
  }
  return password.join('')
}

// console.log(`\nPassword is: ${run(input)}`)
console.log(`\nPassword is: ${runPt2(input)}`)
