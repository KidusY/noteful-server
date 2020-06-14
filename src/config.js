require('dotenv').config();
module.exports= {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_CONNECTION:process.env.DB_URL,
    TEST_DB_CONNECTION: process.env.TEST_DB_URL
}