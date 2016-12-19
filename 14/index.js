var md5 = require('js-md5')

// const SALT = 'abc'
const SALT = 'yjdafjpo'

const triple = /.*?(.)\1\1.*/

const quintuple = (char) => new RegExp('.*(' + char + ')\\1\\1\\1\\1.*')

let key = 0
let index = -1

let hashes = {}

while (key < 64) {
  index++
  let hash = md5(`${SALT}${index}`)
  for (let i = 0; i < 2016; i++) {
    hash = md5(hash)
  }
  if (triple.exec(hash)) {
    let char = triple.exec(hash)[1]
    for (let search = index + 1; search < index + 1001; search++) {
      let hash
      if (hashes[search]) {
        hash = hashes[search]
      } else {
        let hash = md5(`${SALT}${search}`)
        for (let i = 0; i < 2016; i++) {
          hash = md5(hash)
        }
        hashes[search] = hash
      }
      if (quintuple(char).exec(hash)) {
        key++
        console.log(`found quintuple ${key}: ${hash}, index: ${index}, search index: ${search}`)
        break
      }
    }
  }
}

console.log(`index that produces the 64th key: ${index}`)
