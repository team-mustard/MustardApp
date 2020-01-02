import { createLogger, transports, format } from 'winston'
import { AzureApplicationInsightsLogger } from 'winston-azure-application-insights'

const logger = createLogger({
  level: 'debug',
  format: format.errors(),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
})

const appInsights = require('applicationinsights')
try {
  appInsights.setup()
  appInsights.start()
  logger.add(new AzureApplicationInsightsLogger({ insights: appInsights }))
} catch (e) {
  logger.warn('Failed to start Application Insights.')
}

module.exports = logger
