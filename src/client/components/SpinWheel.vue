<template>
  <div ref="myCanvas"></div>
</template>

<script>
import * as PIXI from 'pixi.js'

export default {
  name: 'SpinWheel',
  props: {
    segments: {
      type: Array,
      required: true,
      validator: function (array) {
        return array && Array.isArray(array) && array.every((value) => {
          if (typeof value !== 'object') {
            // eslint-disable-next-line no-console
            console.warn('SpinWheel: Prop "segments": Array entry is not an object', value)
            return false
          }
          if (!value) {
            // eslint-disable-next-line no-console
            console.warn('SpinWheel: Prop "segments": Array entry has no value', value)
            return false
          }
          if (!('label' in value)) {
            // eslint-disable-next-line no-console
            console.warn('SpinWheel: Prop "segments": Missing property "label"', value)
            return false
          }
          if (!('colour' in value)) {
            // eslint-disable-next-line no-console
            console.warn('SpinWheel: Prop "segments": Missing property "colour"', value)
            return false
          } else if (!value.colour) {
            // eslint-disable-next-line no-console
            console.warn('SpinWheel: Prop "segments": Property "colour" has no value', value, value.colour)
            return false
          }
          return true
        })
      }
    }
  },
  created: function () {
    this.calculatedSegments = calculateSegments(this.segments)
  },
  mounted: function () {
    this.app = new PIXI.Application({
      antialias: true,
      transparent: true
    })

    this.wheel = new PIXI.Container()
    this.app.stage.addChild(this.wheel)

    // Draw the wheel according to current parent width
    this.resize = () => {
      const parent = this.app.view.parentNode

      // Redraw all graphics from scratch
      this.wheel.removeChildren()

      // Resize the canvas
      this.app.renderer.resize(parent.clientWidth, parent.clientWidth)

      // Draw the wheel to the new canvas size
      const maxLength = this.app.view.clientWidth
      this.wheel.x = maxLength / 2
      this.wheel.y = maxLength / 2
      this.radius = maxLength / 2 - 10
      drawWheel(this.wheel, this.radius, this.calculatedSegments)
    }

    // TODO spin to selected segment on click event
    // for now, just spin attractively
    let count = 0
    this.app.ticker.add(() => {
      count += 0.1
      this.wheel.rotation = count * 0.1
    })

    this.$refs.myCanvas.appendChild(this.app.view)
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  updated: function () {
    this.calculatedSegments = calculateSegments(this.segments)
    this.resize()
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.resize)
  }
}

function calculateSegments (segments) {
  let calculatedSegments = []
  let arcLeft = 360
  let degreesEach = arcLeft / segments.length

  let currentDegree = 0
  for (const segment of segments) {
    let calculatedSegment = {
      label: segment.label,
      degrees: degreesEach,
      backgroundColour: hex2dec(segment.colour)
    }

    calculatedSegment.startAngle = currentDegree
    currentDegree += degreesEach

    calculatedSegments.push(calculatedSegment)
  }

  return calculatedSegments
}

function drawWheel (container, radius, segmentsData) {
  let degreesUsed = 0
  for (const segmentData of segmentsData) {
    const segment = new PIXI.Container()

    // Create the pie slice
    const graphics = new PIXI.Graphics()
    graphics.lineStyle(4, 0x000000, 1)
    graphics.beginFill(segmentData.backgroundColour)
    graphics.moveTo(0, 0)
    graphics.arc(0, 0, radius, 0, deg2rad(segmentData.degrees))
    graphics.lineTo(0, 0)
    graphics.closePath()
    graphics.endFill()
    segment.addChild(graphics)

    // Put a label on the pie slice
    const fontSize = radius / 10
    const text = new PIXI.Text(`    ${segmentData.label}`, { fontSize: fontSize })
    text.angle = segmentData.degrees / 2
    text.x = text.height
    text.y = 0
    segment.addChild(text)

    // Add the slice to the wheel
    degreesUsed += segmentData.degrees
    segment.angle = degreesUsed
    container.addChild(segment)
  }
}

function deg2rad (degrees) {
  return degrees * (Math.PI / 180)
}

function hex2dec (hex) {
  return parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16)
}
</script>
