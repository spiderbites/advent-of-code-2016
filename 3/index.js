const fs = require('fs')

const rowInputs = fs.readFileSync('input.txt', 'utf8').split('\n')
  .map(line => line.trim().split(/\s+/)
  .map(num => parseInt(num)))

let colInputs = rowInputs.map(arr => arr.slice())
rowInputs.forEach((row, i) => {
  if (i % 3 === 0) {
    colInputs[i][1] = rowInputs[i+1][0]
    colInputs[i][2] = rowInputs[i+2][0]
    colInputs[i+1][0] = rowInputs[i][1]
    colInputs[i+1][2] = rowInputs[i+2][1]
    colInputs[i+2][0] = rowInputs[i][2]
    colInputs[i+2][1] = rowInputs[i+1][2]
  }
})

const isTriangle = ([a, b, c]) => {
  return a + b > c &&
         a + c > b &&
         b + c > a
}

let rowTriangles = rowInputs.reduce((total, shape) => {
  return isTriangle(shape) + total
}, 0)

console.log(`Total row triangles: ${rowTriangles}`)

let colTriangles = colInputs.reduce((total, shape) => {
  return isTriangle(shape) + total
}, 0)

console.log(`Total column triangles: ${colTriangles}`)
