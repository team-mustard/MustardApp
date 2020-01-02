module.exports = {
  async getSetting (name) {
    if (name in process.env) {
      return process.env[name]
    }

    console.log(`No such setting: ${name}.`)
    return null
  }
}
