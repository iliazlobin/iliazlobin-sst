import { log } from 'console'

function* generator(i: number) {
  yield i
  yield i + 10
}

const gen = generator(10)

console.log(gen.next().value)
// Expected output: 10

console.log(gen.next().value)
// Expected output: 20
