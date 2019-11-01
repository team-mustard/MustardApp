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
  updated: function () {
    this.calculatedSegments = calculateSegments(this.segments)
    // TODO re-render when props change
  },
  mounted: function () {
    this.app = new PIXI.Application({
      antialias: true,
      resizeTo: this.$refs.myCanvas,
      transparent: true
    })
    this.app.renderer.autoResize = true

    const wheel = new PIXI.Container()
    wheel.x = this.app.view.width / 2
    wheel.y = this.app.view.height / 2

    const radius = this.app.view.height / 2 - 10
    let degreesUsed = 0
    for (const calculatedSegment of this.calculatedSegments) {
      const segment = new PIXI.Container()

      const graphics = new PIXI.Graphics()
      graphics.lineStyle(4, 0x000000, 1)
      graphics.beginFill(calculatedSegment.backgroundColour)
      graphics.moveTo(0, 0)
      graphics.arc(0, 0, radius, 0, deg2rad(calculatedSegment.degrees))
      graphics.lineTo(0, 0)
      graphics.closePath()
      graphics.endFill()
      segment.addChild(graphics)

      const text = new PIXI.Text(calculatedSegment.label)
      // text.anchor.set(0, 0.5)
      text.angle = calculatedSegment.degrees / 2
      text.x = radius * 0.25
      text.y = text.angle - (text.height / 2)
      segment.addChild(text)

      degreesUsed += calculatedSegment.degrees
      segment.angle = degreesUsed
      wheel.addChild(segment)
    }

    this.app.stage.addChild(wheel)

    // TODO spin to selected segment on click event
    // for now, just spin attractively
    let count = 0
    this.app.ticker.add(() => {
      count += 0.1
      wheel.rotation = count * 0.1
    })

    this.$refs.myCanvas.appendChild(this.app.view)
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

function deg2rad (degrees) {
  return degrees * (Math.PI / 180)
}

function hex2dec (hex) {
  return parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16)
}
</script>
