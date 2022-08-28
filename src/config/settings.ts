import * as dotenv from "dotenv";
dotenv.config();

export const settings = {
    mongo_URI: process.env.MONGO_URI || "mongodb://localhost:27017/blog",
    jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || "secret",
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || "mysecret",
    mailPass: process.env.MAIL_PASS,
};
