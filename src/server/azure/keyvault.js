import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
import settings from '../settings.js'

module.exports = {
  async getSecret (name) {
    const client = await getSecretClient()

    const secretName = name.replace(/_/g, '-')
    const secret = await client.getSecret(secretName)
    console.log(secret)
    return null
  }
}

var secretClient = null

async function getSecretClient () {
  if (secretClient === null) {
    console.log(settings)
    const keyVaultName = await settings.getSetting('KEYVAULT_NAME')
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`

    const credential = new DefaultAzureCredential()
    secretClient = new SecretClient(keyVaultUri, credential)
  }

  return secretClient
}
