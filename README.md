# flowingChart

Flowing Chart Web Component

![](img/2020-01-12T20:31:57+01:00_680x183.gif "Simple and minimalist design for changing data")

## Features

- A totally independent **Web Component**
- CSS Encapsulation with **Shadow DOM**
- Takes sync or **async** iterators as data input
- Uses the **Canvas API**
- Stops, waits and continues automatically for data
- Everything is **customizable**

## Quick Start

```shell
npm start
```

## Api

```
"width",
"height",
"xMax",
"yMax",
"chartColor",
"axisColor",
"lineWidth",
"iterator"
```

## Example

```html
<flowing-chart iterator="0327529439" x-max="10" y-max="10" chart-color="orange">
</flowing-chart>
```

For more animated and asynchronous examples look into the
[**example**](https://github.com/timonson/flowingChart/tree/master/example)
folder.

![](img/2020-01-12T20:08:56+01:00_636x316.gif "Simple and minimalist design for changing data")
