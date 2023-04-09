export const config = () => ({
    mongo_URI: process.env.MONGO_URI || "mongodb://localhost:27017/blog",
    login: process.env.LOGIN || "name",
    password: process.env.BASIC_PASSWORD || "basic",
    jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || "secret",
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || "mysecret",
    mailPass: process.env.MAIL_PASS,
    ttl: process.env.TTL || 10,
    limit: process.env.LIMIT || 5,
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
});
