var fs = require('fs')
var _ = require('lodash')

const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(line => line.trim())

const containsABBA = (str) => {
  for (var i = 0; i <= str.length - 4; i++) {
    if ((str[i] === str[i + 3]) &&
        (str[i + 1] === str[i + 2]) &&
        (str[i] !== str[i + 1])) {
      return true
    }
  }
  return false
}

const extract = (str) => {
  const outsideBrackets = str.split(/\[.*?]/)
  const insideBrackets = str.match(/\[(.*?)]/g)
    .map(word => word.replace('[', '').replace(']', ''))
  return { outsideBrackets, insideBrackets }
}

const supportsTLS = (str) => {
  const { outsideBrackets, insideBrackets } = extract(str)
  return _.some(outsideBrackets, (w) => containsABBA(w)) &&
         _.every(insideBrackets, (w) => !containsABBA(w))
}

const run = (arr, f) => {
  return arr.reduce((acc, line) => acc + f(line), 0)
}

const getABAsOrBABs = (str) => {
  let arr = []
  for (var i = 0; i <= str.length - 3; i++) {
    if ((str[i] === str[i + 2]) &&
        (str[i] !== str[i + 1])) {
      arr.push(str.slice(i, i + 3))
    }
  }
  return arr
}

const flatten = (arrOfArrs) => {
  return arrOfArrs.reduce((acc, cur) => {
    return acc.concat(cur)
  }, [])
}

const invertABA = (str) => {
  return str[1] + str[0] + str[1]
}

const supportsSSL = (str) => {
  const { outsideBrackets, insideBrackets } = extract(str)
  const supernets = flatten(outsideBrackets.map(s => getABAsOrBABs(s)))
  const hypernets = flatten(insideBrackets.map(s => getABAsOrBABs(s))).map(s => invertABA(s))
  return _.intersection(supernets, hypernets).length > 0
}

console.log(`Num supporting TLS: ${run(input, supportsTLS)}`)

console.log(`Num supporting SSL: ${run(input, supportsSSL)}`)
