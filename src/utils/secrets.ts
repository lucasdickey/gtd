import { SecretsManager } from '@aws-sdk/client-secrets-manager'

export async function getSecrets() {
  const client = new SecretsManager({
    region: 'us-east-2', // Your secret is in us-east-2
  })

  try {
    const response = await client.getSecretValue({
      SecretId: 'Service_Credentials', // Using your existing secret name
    })

    if (response.SecretString) {
      const secrets = JSON.parse(response.SecretString)
      return secrets
    }

    throw new Error('Secret value not found')
  } catch (error) {
    console.error('Error fetching secrets:', error)
    throw error
  }
}
