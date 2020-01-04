import moment from 'moment'
import settings from './settings.js'
import { dayOptions } from './store.js'
import googleCalendar from './google/calendar.js'

const mustardDayEvent = {
  summary: 'Mustard Day'
}

module.exports = {
  async getMustardDay (date) {
    const startOfWeek = moment(date).startOf('week')
    const endOfWeek = moment(date).endOf('week')

    const event = await getMustardDayEvent(startOfWeek, endOfWeek)
    const day = getDayFromEvent(event)
    return day
  },

  async setMustardDay (date) {
    const startOfWeek = moment(date).startOf('week')
    const endOfWeek = moment(date).endOf('week')

    // First check if Mustard Day was already set for this week
    let event = await getMustardDayEvent(startOfWeek, endOfWeek)
    if (!event) {
      const chosenDate = await pickMustardDayDate(startOfWeek)
      event = await setMustardDayEvent(chosenDate)
    }

    const day = getDayFromEvent(event)
    return day
  }
}

async function getMustardDayEvent (startOfWeek, endOfWeek) {
  const calendarId = await settings.getSetting('GOOGLE_CALENDAR_ID')
  const events = await googleCalendar.getEvents(calendarId, startOfWeek.format(), endOfWeek.format())
  const event = events.find(e => e.summary === mustardDayEvent.summary)
  return event
}

async function pickMustardDayDate (startOfWeek) {
  // TODO use the calendar to choose the day, so we can ignore holidays
  const chosenDay = dayOptions[Math.floor(Math.random() * dayOptions.length)]
  const chosenDate = moment(startOfWeek).day(chosenDay.label)
  return chosenDate.format('YYYY-MM-DD')
}

async function setMustardDayEvent (date) {
  const calendarId = await settings.getSetting('GOOGLE_CALENDAR_ID')
  const event = await googleCalendar.createEvent(calendarId, date, mustardDayEvent.summary)
  return event
}

function getDayFromEvent (event) {
  if (event) {
    const eventDate = moment(event.start.date)
    const dayOfWeek = eventDate.format('dddd')
    const day = dayOptions.find(e => e.label === dayOfWeek)
    return day
  } else {
    return null
  }
}
