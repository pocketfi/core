import {config} from "dotenv";

config();

export default {
    PORT: process.env.PORT,
    MONGO_URI: process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : process.env.MONGO_URI_TEST,
    JWT_SECRET: process.env.JWT_SECRET
};
