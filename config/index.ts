import {config} from 'dotenv'

config()

export default {
  PORT: process.env.PORT,
  WS_PORT: process.env.WS_PORT,
  CLIENT_PORT: process.env.CLIENT_PORT,
  HOST: process.env.HOST,
  MONGO_URI: process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : process.env.MONGO_URI_TEST,
  MONGO_URI_TEST: process.env.MONGO_URI_TEST,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}
