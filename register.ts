import { register } from 'ts-node'
import { pathToFileURL } from 'url'

register({
  // You can add any ts-node options here
})

// Load the script you want to run
import('./scripts/verify-setup.ts').catch(console.error)
