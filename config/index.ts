import {config} from 'dotenv'

if (!process.env.NODE_ENV) {
  throw new Error('No node environment specified. Provide NODE_ENV=[dev/test/prod] environment variable')
} else {
  config({path: `.env.${process.env.NODE_ENV}`})
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
