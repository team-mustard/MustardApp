import keyvault from './azure/keyvault.js'

module.exports = {
  async getSecret (name) {
    if (name in process.env) {
      return process.env[name]
    }

    const keyvaultSecret = await keyvault.getSecret(name)
    if (keyvaultSecret !== null) {
      return keyvaultSecret
    }

    console.log(`No such secret: ${name}.`)
    return null
  }
}
