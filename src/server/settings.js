import logger from './logger.js'

module.exports = {
  async getSetting (name) {
    if (name in process.env) {
      return process.env[name]
    }

    logger.warn(`No such setting: ${name}.`)
    return null
  }
}
