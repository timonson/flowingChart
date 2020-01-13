function random(min = 1, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function delay(value, duration = 1000) {
  return new Promise(function makePromiseInsideDelay(resolve, reject) {
    setTimeout(function() {
      if (value instanceof Error) reject(value)
      resolve(value)
    }, duration)
  })
}

function* generator(range, time) {
  let i = 0
  while (i++ < 200) {
    const randomNumber = random(...range)
    yield delay(randomNumber, time)
  }
}

export { generator }
