import {config} from "dotenv";

config();

export default {
    PORT: process.env.PORT,
    ATLAS_URI: process.env.NODE_ENV === 'production' ? process.env.ATLAS_URI : process.env.ATLAS_URI_TEST,
    JWT_SECRET: process.env.JWT_SECRET
};
