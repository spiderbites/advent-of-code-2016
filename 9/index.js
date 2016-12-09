var fs = require('fs')
var _ = require('lodash')

let input = fs.readFileSync('./input.txt', 'utf8')
// input = '(3x3)XYZ'
let output = ''

var i = 0
while (i < input.length) {
  if (input[i] === '(') {
    let end = input.indexOf(')', i)
    let marker = input.slice(i + 1, end + 1).split('x').map(num => parseInt(num))
    let num = marker[0]
    let repeats = marker[1]

    for (var j = 0; j < repeats; j++) {
      output = output + input.slice(end + 1, end + 1 + num)
    }
    i = end + 1 + num
  }
  else {
    output = output + input[i]
    i++
  }
}

console.log(output)
console.log(output.length)