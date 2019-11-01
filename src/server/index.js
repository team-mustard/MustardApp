import express from 'express'
import path from 'path'
import { dayOptions } from './store.js'

const app = express()

// API
app.get('/api/days', (req, res) => {
  res.send(dayOptions)
})

app.get('/api/days/:dayId', (req, res) => {
  const day = dayOptions.find(e => e.id == req.params.dayId)
  if (day) {
    res.send(day)
  } else {
    res.status(404).send()
  }
})

app.post('/api/days/actions/pick', (req, res) => {
  const selectedDay = dayOptions[Math.floor(Math.random() * dayOptions.length)]
  res.send(selectedDay)
})

// Serve client out of the dist folder
app.set('client', path.resolve('.', 'dist', 'client'))
app.use(express.static(app.get('client')))

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
