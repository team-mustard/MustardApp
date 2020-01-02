module.exports = {
  async getSetting (name) {
    if (name in process.env) {
      return process.env[name]
    }

    console.log(`No such setting: ${name}.`)
    return null
  },

  async getSecretSetting (name) {
    if (name in process.env) {
      return process.env[name]
    }

    // TODO: Azure Key Vault support

    console.log(`No such secret: ${name}.`)
    return null
  }
}
