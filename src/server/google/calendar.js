import { google } from 'googleapis'
import settings from '../settings.js'
import secrets from '../secrets.js'

const calendar = google.calendar('v3')

module.exports = {
  async createCalendar(calendarId, summary, description = null) {
    const client = await getClient()
    const response = await calendar.calendars.insert({
      auth: client,
      requestBody: {
        description,
        summary
      }
    })
  },

  async grantAccess(calendarId, userEmail, role = 'reader') {
    const client = await getClient()
    const response = await calendar.acl.insert({
      auth: client,
      calendarId,
      requestBody: {
        role,
        scope: {
          type: 'user',
          value: userEmail
        }
      }
    })
  },

  async getEvents(calendarId, start, end) {
    const client = await getClient()
    const response = await calendar.events.list({
      auth: client,
      calendarId,
      timeMin: start,
      timeMax: end
    })

    return response.data.items
  },

  async createEvent(calendarId, date, summary, description = null) {
    const client = await getClient()
    const response = await calendar.events.insert({
      auth: client,
      calendarId,
      requestBody: {
        description,
        end: {
          date
        },
        start: {
          date
        },
        summary,
        transparency: 'transparent'
      }
    })

    return response.data
  },

  async deleteEvent(calendarId, eventId) {
    const client = await getClient()
    const response = await calendar.events.delete({
      auth: client,
      calendarId,
      eventId
    })
  }
}

let jwtClient = null

async function getClient() {
  if (jwtClient === null) {
    const clientEmail = await settings.getSetting('GOOGLE_CLIENT_EMAIL')
    const privateKey = await secrets.getSecret('GOOGLE_PRIVATE_KEY')

    const scopes = ['https://www.googleapis.com/auth/calendar']

    jwtClient = new google.auth.JWT(clientEmail, null, privateKey, scopes)

    await jwtClient.authorize(error => {
      if (error) {
        throw error
      }
    })
  }

  return jwtClient
}
