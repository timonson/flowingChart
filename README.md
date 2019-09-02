# flowingChart

It only takes one function to animate a customizable chart which takes any kind of
iterator as input.

![](img/2019-09-02T04:43:52+02:00_652x330.gif 'Simple and minimalist design for changing data')

## Features

- Takes sync and **async** iterators as data input
- Uses the Canvas API
- Stops, waits and continues automatically for data
- All units of the coordinate system are customizable

## Api

**flowingChart( iterator, canvasContext, [options] )**

#### Options : Object

Optionally, the following properties of the _options_ object are available:

- xMax : number, defines the amount of units on the X-Axis (default: 10)
- yMax : number, defines the amount of units on the Y-Axis (default: 300)
- colorChart : string, the color of the lines of the chart (default: blue)
- colorAxis : string, the color of the coordinate axes (default: black)

## Example

```javascript
  <body>
    <script type="module">
      import flowingChart from './flowingChart.js'
      const iterator = '0322325327529429'
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      ctx.width = 300
      ctx.height = 150
      document.body.append(canvas)
      flowingChart(iterator, ctx, {yMax: 10})
    </script>
  </body>
```

For more animated and asynchronous examples look into the **example** folder.
