import flowingChart from '../flowingChart.js'

function makeCanvasContext(id, canvasWidth, canvasHeight) {
  const canvas = document.getElementById(id)
  if (!canvas) throw Error(`canvas element with the id ${id} could not be found!`)
  if (!canvas.getContext)
    throw Error(`canvas context with the id ${id} could not be created!`)
  if (canvasWidth) canvas.width = canvasWidth
  if (canvasHeight) canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')
  ctx.width = canvas.width
  ctx.height = canvas.height
  // ctx is 'canvas context'
  return ctx
}

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

function* generator() {
  let i = 0
  while (i++ < 200) {
    const randomNumber = random(0, 300)
    yield delay(randomNumber, 250)
  }
}

const canvasContext = makeCanvasContext('mainCanvas', 600, 300)

flowingChart(generator(), canvasContext, {
  xMax: 20,
  yMax: 400,
  colorChart: 'blue',
  colorAxis: 'black',
}) 
