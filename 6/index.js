var fs = require('fs')
var _ = require('lodash')

const testFile = fs.readFileSync('./test.txt', 'utf8').split('\n')
const input = fs.readFileSync('input.txt', 'utf8').split('\n')

const keyWithMaxValue = (obj) => {
  let max = Math.max(...Object.values(obj))
  return _.findKey(obj, (value) => value === max)
}

const run = (input) => {
  let result = []
  for (var i = 0; i < input[0].length; i++) {
    result.push({})
  }
  input.forEach(line => {
    for (var i = 0; i < line.length; i++) {
      result[i][line[i]] = (result[i][line[i]] || 0) + 1
    }
  })
  return result.map(obj => keyWithMaxValue(obj)).join('')
}

// console.log(`error-corrected version: ${run(testFile)}`)
console.log(`error-corrected version: ${run(input)}`)
