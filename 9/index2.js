var fs = require('fs')
var _ = require('lodash')

let input = fs.readFileSync('./input.txt', 'utf8')

function len (str) {
  let length = 0

  while (str.length > 0) {
    if (str[0] !== '(') {
      length += 1
      str = str.substr(1)
    } else {
      let end = str.indexOf(')')
      let marker = str.slice(1, end).split('x').map(num => parseInt(num))
      let num = marker[0]
      let repeats = marker[1]

      const sublength = len(str.substr(end + 1, num))
      length += sublength * repeats

      str = str.substr(end + 1 + num)
    }
  }
  return length
}

console.log(len(input))
