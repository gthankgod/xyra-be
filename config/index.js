const dotenv = require('dotenv');
if (process.env.NODE_ENV != 'production') {
    dotenv.config({ path: '.env' });
}
module.exports = {
    app_name: process.env.APP_NAME || 'XYRA-FINANCE',
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    request_timeout: process.env.REQUEST_TIMEOUT || 30000,
    db_host: process.env.DB_HOST,
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    mongo_uri: process.env.MONGO_URI,
    open_api_key: process.env.OPENAI_API_KEY,
}
