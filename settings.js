require('dotenv').config()

exports = module.exports = {
    dbSettings: {
        db: process.env.DB_NAME,
        user: process.env.DB_USER,
        pwd: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
    },
    mailer: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
    },
    sendTo: process.env.SEND_TO,
    url: 'https://www.dns-shop.ru/product/d11049989ce12ff1/75-190-sm-televizor-led-xiaomi-mi-tv-q1-75-serebristyj/'
}
