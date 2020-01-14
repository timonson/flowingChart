async function* drawFlowingChart() {
  while (true) {
    const [
      iterator,
      ctx,
      { xMax, yMax, chartColor, axisColor, lineWidth, cancelCheck } = {},
    ] = yield
    const valuesToDraw = Array(xMax).fill(undefined)
    function getXOffset(value) {
      return (value / xMax) * ctx.width
    }
    function getYOffset(value) {
      return ctx.height - (value / yMax) * ctx.height
    }
    function drawCoordinateSystem(ctx) {
      ctx.beginPath()
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = axisColor
      ctx.moveTo(0, 0)
      ctx.lineTo(0, ctx.height)
      ctx.lineTo(ctx.width, ctx.height)
      ctx.stroke()
    }
    function drawText(ctx, text, x, y) {
      ctx.font = "14px mono"
      ctx.fillStyle = "grey"
      ctx.fillText(text, x, y)
    }
    function drawCurvedChart(points, [x0, y0]) {
      for (var i = 0; i < points.length - 1; i++) {
        var x_mid = (points[i].x + points[i + 1].x) / 2
        var y_mid = (points[i].y + points[i + 1].y) / 2
        var cp_x1 = (x_mid + points[i].x) / 2
        var cp_x2 = (x_mid + points[i + 1].x) / 2
        if (i === 0) {
          var sx_mid = (x0 + points[0].x) / 2
          var sy_mid = (y0 + points[0].y) / 2
          var scp_x1 = (sx_mid + x0) / 2
          var scp_x2 = (sx_mid + points[0].x) / 2
          ctx.quadraticCurveTo(scp_x1, y0, sx_mid, sy_mid)
          ctx.quadraticCurveTo(scp_x2, points[0].y, points[0].x, points[0].y)
        }
        ctx.quadraticCurveTo(cp_x1, points[i].y, x_mid, y_mid)
        ctx.quadraticCurveTo(
          cp_x2,
          points[i + 1].y,
          points[i + 1].x,
          points[i + 1].y
        )
      }
    }
    for await (const value of iterator) {
      ctx.clearRect(0, 0, ctx.width, ctx.height)
      drawText(ctx, xMax, ctx.width - 25, ctx.height - 5)
      drawText(ctx, yMax, 5, 15)
      drawCoordinateSystem(ctx)
      ctx.beginPath()
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = chartColor
      const yValueAtX0 = getYOffset(valuesToDraw.shift()) || ctx.height
      valuesToDraw.push(parseInt(value))
      const firstIndex = valuesToDraw.findIndex(el => typeof el === "number")
      const xValueAtY0 = getXOffset(firstIndex >= 0 ? firstIndex : 0)
      ctx.moveTo(xValueAtY0, yValueAtX0)
      const points = valuesToDraw.reduce((acc, el, i) => {
        acc.push({ x: getXOffset(i + 1), y: getYOffset(el) })
        return acc
      }, [])
      drawCurvedChart(points, [xValueAtY0, yValueAtX0])
      ctx.stroke()
      if (cancelCheck.stopDrawing) break
    }
  }
}

function makeCanvasContext(
  canvas,
  sizeX,
  sizeY,
  adaptCtxSize = true,
  ctxType = "2d"
) {
  if (!canvas.getContext)
    return console.error(`Could not create ctx for canvas!`)
  if (sizeX) canvas.width = sizeX
  if (sizeY) canvas.height = sizeY
  const ctx = canvas.getContext(ctxType)
  ctx.width = canvas.width
  ctx.height = canvas.height
  return ctx
}

function coupleSettersAndGettersToAttributes(thisObj, camelCasePropsAsStrings) {
  function camelCaseToDash(str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase()
  }
  for (const propertyName of camelCasePropsAsStrings) {
    Object.defineProperty(thisObj, propertyName, {
      get: function() {
        return this.getAttribute(camelCaseToDash(propertyName))
      },
      set: function(value) {
        return this.setAttribute(camelCaseToDash(propertyName), value)
      },
    })
  }
}

function defineFlowingChart(tag) {
  class FlowingChart extends HTMLElement {
    constructor() {
      super()
      coupleSettersAndGettersToAttributes(this, [
        "width",
        "height",
        "xMax",
        "yMax",
        "chartColor",
        "axisColor",
        "lineWidth",
      ])
      ;(this.observer = drawFlowingChart()).next()
      this.cancelCheck = { stopDrawing: false }
      this.xMax = this.xMax || 10
      this.yMax = this.yMax || 200
      this.chartColor = this.chartColor || "deepskyblue"
      this.axisColor = this.axisColor || "grey"
      this.lineWidth = this.lineWidth || 2.0
      this.style.display = "inline-block"
      this.style.margin = "1em"
      this.canvas = document.createElement("canvas")
      this.attachShadow({ mode: "open" }).appendChild(this.canvas)
      this.ctx = makeCanvasContext(this.canvas, this.width, this.height)
      this.drawIterator()
    }

    get iterator() {
      return this._iterator
    }
    set iterator(iterator) {
      this._iterator = iterator
      this.drawIterator()
    }

    drawIterator() {
      if (!this.iterator) return
      this.observer.next([
        this.iterator,
        this.ctx,
        {
          xMax: parseInt(this.xMax),
          yMax: parseInt(this.yMax),
          chartColor: this.chartColor,
          axisColor: this.axisColor,
          lineWidth: parseInt(this.lineWidth),
          cancelCheck: this.cancelCheck,
        },
      ])
    }
    static get observedAttributes() {
      return [
        "width",
        "height",
        "iterator",
        "x-max",
        "y-max",
        "chart-color",
        "axis-color",
        "line-width",
      ]
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue === oldValue) return
      if (name === "iterator") return (this.iterator = newValue)
      this.cancelCheck.stopDrawing = true
      this.cancelCheck = { stopDrawing: false }
      if (name === "width" || name === "height")
        makeCanvasContext(this.canvas, this.width, this.height)
      this.drawIterator()
    }
  }
  return customElements.define(tag, FlowingChart)
}

defineFlowingChart("flowing-chart")
