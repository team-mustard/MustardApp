import express from 'express'
import path from 'path'
import calendar from './calendar.js'
import { dayOptions } from './store.js'
import logger from './logger.js'

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
    res.sendStatus(404)
  }
})

app.get('/api/mustardDay', async (req, res) => {
  try {
    const mustardDay = await calendar.getMustardDay(new Date())
    res.send(mustardDay)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
})

app.post('/api/days/actions/pick', async (req, res) => {
  try {
    const mustardDay = await calendar.setMustardDay(new Date())
    res.send(mustardDay)
  } catch (e) {
    logger.error(e)
    res.sendStatus(500)
  }
})

// Serve client out of the dist folder
app.set('client', path.resolve('.', 'dist', 'client'))
app.use(express.static(app.get('client')))

const port = process.env.PORT || 3000
app.listen(port, () => {
  logger.info(`Listening on port ${port}...`)
})
