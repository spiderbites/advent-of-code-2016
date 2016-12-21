const DISK_LENGTH = 35651584 // 272
const INITIAL = '10011111011011001'

const gen1 = a => {
  let b = flip(reverse(a.slice()))
  return a + '0' + b
}

const reverse = s => {
  return s.split('').reverse().join('')
}

const flip = s => {
  return s.split('').map(c => c === '0' ? '1' : '0').join('')
}

const generate = (initial, len) => {
  let res = initial
  while (res.length < len) { res = gen1(res) }
  return res.slice(0, len)
}

const pairChecksum = data => {
  let res = []
  for (let i = 0; i < data.length; i += 2) {
    res.push(data[i] === data[i + 1] ? '1' : '0')
  }
  return res.join('')
}

const checksum = data => {
  let res = pairChecksum(data)
  while (res.length % 2 === 0) {
    res = pairChecksum(res)
  }
  return res
}

console.log(checksum(generate(INITIAL, DISK_LENGTH)))
