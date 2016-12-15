var fs = require('fs')

let input = fs.readFileSync('./input.txt', 'utf8').split('\n')

let bots = new Map()
let outputs = new Map()

let giveList = []

const valueToBot = /value (\d+) goes to bot (\d+)/
const getBot = /bot (\d+).*/
const botGives = /bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/

const giveValToBot = (val, bot) => {
  bots[bot] = (bots[bot] || [])
  bots[bot].push(val)
}

const giveValToOutput = (val, o) => {
  outputs[o] = (outputs[o] || [])
  outputs[o].push(val)
}

const giveInitialVals = () => {
  input.forEach((line, index) => {
    let match = valueToBot.exec(line)
    if (match) {
      giveValToBot(match[1], match[2])
    } else {
      giveList.push(line)
    }
  })
}

const processGive = (line) => {
  let match = botGives.exec(line)
  const [, giver, lowType, lowReceiver, highType, highReceiver] = match
  let lowVal = Math.min(...bots[giver])
  let highVal = Math.max(...bots[giver])
  lowType === 'bot' ? giveValToBot(lowVal, lowReceiver) : giveValToOutput(lowVal, lowReceiver)
  highType === 'bot' ? giveValToBot(highVal, highReceiver) : giveValToOutput(highVal, highReceiver)
}

const processLine = (line) => {
  let bot = getBot.exec(line)[1]
  if (bots[bot] && bots[bot].length === 2) {
    processGive(line)
    bots.delete(bot)
    return true
  }
  return false
}

const run = () => {
  let index = 0
  while (giveList.length > 0) {
    if (processLine(giveList[index])) {
      giveList.splice(index, 1)
    } else {
      index++
    }
    if (index >= giveList.length) index = 0
  }
}

giveInitialVals()
run()
console.log(`>>>>>>>>>>>> BOTS`)
console.log(bots)
console.log(`>>>>>>>>>>>> OUTPUTS`)
console.log(outputs)
console.log(outputs[0] * outputs[1] * outputs[2])
