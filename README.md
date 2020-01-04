# Team Mustard

The app that picks Team Mustard day!

## Building and running

First install dependencies:

```sh
npm install
```

To run in hot module reloading mode:

```sh
npm run dev
```

To create and serve a production build:

```sh
npm run build
npm start
```

## Data storage

When a Mustard Day is picked, it's stored in a Google Calendar.

The exact credentials/calendar are defined by settings, but the main app
is set up like this:

- team.mustardd@gmail.com has a calendar called "Mustard Days"
- That calendar is shared to a [Service Account](https://cloud.google.com/iam/docs/service-accounts)
- This app then uses that service account to create events in the calendar

The two relevant API endpoints are:

- `GET /api/mustardDay`
  - Gets this week's Mustard Day (if set)
  - Returns an object describing the day, or `null` if no day is set yet
    for this week
- `POST /api/mustardDay/actions/pick`
  - Picks the day for Mustard Day this week
  - If a day is already set, then it just returns that day
  - If a day isn't already set, then it picks a random day and creates the
    calendar event
  - Returns an object describing the day
