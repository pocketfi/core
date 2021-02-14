import {config} from 'dotenv'
import * as fs from 'fs'

if (!process.env.NODE_ENV) {
  throw new Error('No node environment specified. Provide NODE_ENV=[dev/test/prod] environment variable')
} else {
  const path = `.env.${process.env.NODE_ENV}`
  if (fs.existsSync(path)) {
    config({path: path})
  }
}

export default {
  PORT: process.env.PORT,
  WS_PORT: process.env.WS_PORT,
  CLIENT_PORT: process.env.CLIENT_PORT,
  HOST: process.env.HOST,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}
