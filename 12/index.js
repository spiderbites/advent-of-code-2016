var fs = require('fs')

const input = (file) => {
  return fs.readFileSync(`./${file}.txt`, 'utf8').split('\n')
}

let registers = {
  a: 0,
  b: 0,
  c: 1,
  d: 0
}

const isDigit = /\d+/
const twoVars = /(.+) (.+) (.+)/
const oneVar = /(.+) (.+)/

const runInstruction = (instruction, num) => {
  let command, x, y
  if (twoVars.exec(instruction)) {
    [, command, x, y] = twoVars.exec(instruction)
  } else {
    [, command, x] = oneVar.exec(instruction)
  }

  let jump
  switch (command) {
    case 'cpy':
      cpy(x, y)
      break
    case 'inc':
      inc(x)
      break
    case 'dec':
      dec(x)
      break
    case 'jnz':
      jump = jnz(x, y)
  }
  return jump ? num + parseInt(jump) : num + 1
}

const run = (input) => {
  let currentInstruction = 0
  while (currentInstruction < input.length) {
    currentInstruction = runInstruction(input[currentInstruction], currentInstruction)
  }
  return registers
}

// cpy x y copies x (either an integer or the value of a register) into register y.
// inc x increases the value of register x by one.
// dec x decreases the value of register x by one.
// jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.


const cpy = (x, y) => {
  if (isDigit.test(x)) {
    registers[y] = x
  } else {
    registers[y] = registers[x]
  }
}

const inc = (x) => {
  registers[x]++
}

const dec = (x) => {
  registers[x]--
}

const jnz = (x, y) => {
  let num
  num = isDigit.test(x) ? x : registers[x]
  if (num !== 0) {
    return y
  }
}

console.log(run(input('input')))
