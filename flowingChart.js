export default async function flowingChart(
  iterator,
  ctx,
  {xMax = 10, yMax = 300, colorChart = 'blue', colorAxis = 'black'} = {}
) {
  const valuesToDraw = Array(xMax)
  let x0Value = ctx.height
  function getXOffset(value) {
    return (value / xMax) * ctx.width
  }
  function getYOffset(value) {
    return ctx.height - (value / yMax) * ctx.height
  }
  function drawCoordinateSystem(ctx) {
    ctx.beginPath()
    ctx.lineWidth = 6.0
    ctx.strokeStyle = colorAxis
    ctx.moveTo(0, 0)
    ctx.lineTo(0, ctx.height)
    ctx.lineTo(ctx.width, ctx.height)
    ctx.stroke()
  }
  function drawText(ctx, text, x, y) {
    ctx.font = '14px mono'
    ctx.fillStyle = 'grey'
    ctx.fillText(text, x, y)
  }
  for await (const value of iterator) {
    ctx.clearRect(0, 0, ctx.width, ctx.height)
    drawText(ctx, xMax, ctx.width - 30, ctx.height - 10)
    drawText(ctx, yMax, 10, 15)
    drawCoordinateSystem(ctx)
    ctx.beginPath()
    ctx.lineWidth = 3.0
    ctx.strokeStyle = colorChart
    x0Value = getYOffset(valuesToDraw.shift()) || ctx.height
    valuesToDraw.push(value)
    ctx.moveTo(
      getXOffset(valuesToDraw.findIndex(el => typeof el === 'number')),
      x0Value
    )
    valuesToDraw.forEach((element, index) =>
      ctx.lineTo(getXOffset(index + 1), getYOffset(element))
    )
    ctx.stroke()
  }
}
