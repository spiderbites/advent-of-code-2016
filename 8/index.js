var fs = require('fs')

const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(line => line.trim())

let screen = [
  Array(50).fill('.'),
  Array(50).fill('.'),
  Array(50).fill('.'),
  Array(50).fill('.'),
  Array(50).fill('.'),
  Array(50).fill('.')
]

const rect = (line) => {
  let parsed = line.slice(5).split('x').map(x => parseInt(x))
  let width = parsed[0]
  let height = parsed[1]
  for (var h = 0; h < height; h++) {
    for (var w = 0; w < width; w++) {
      screen[h][w] = '#'
    }
  }
}

const rotateRow = (line) => {
  let parsed1 = line.slice(11).split(' ')
  let row = parseInt(parsed1[0].split('=')[1])
  let num = parseInt(parsed1[2])
  let newRow = screen[row].slice(0)

  for (var w = 0; w < screen[row].length; w++) {
    newRow[w] = screen[row][(50 - num + w) % 50]
  }
  screen[row] = newRow.slice(0)
}

const rotateCol = (line) => {
  let parsed1 = line.slice(16).split(' ')
  let col = parseInt(parsed1[0])
  let num = parseInt(parsed1[2])

  let oldCols = Array(6).fill('.')
  for (var h = 0; h < 6; h++) {
    oldCols[h] = screen[h][col]
  }

  for (h = 0; h < 6; h++) {
    screen[h][col] = oldCols[(6 - num + h) % 6]
  }
}

const printScreen = () => {
  for (var h = 0; h < screen.length; h++) {
    for (var w = 0; w < screen[0].length; w++) {
      process.stdout.write(screen[h][w])
    }
    process.stdout.write('\n')
  }
}


for (var line of input) {
  if (line.startsWith('rect')) {
    rect(line)
  } else if (line.startsWith('rotate row')) {
    rotateRow(line)
  } else {
    rotateCol(line)
  }
}

printScreen()

var count = 0

for (line of screen) {
  for (var char of line) {
    if (char === '#') {
      count += 1
    }
  }
}

console.log(count)
