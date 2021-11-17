const nodemailer = require('nodemailer')
const settings = require('../settings')

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: settings.mailer.host,
            port: settings.mailer.port,
            secure: false,
            auth: {
                user: settings.mailer.user,
                pass: settings.mailer.password
            }
        })
    }

    async sendMail (to, price, priceWith24) {
        await this.transporter.sendMail({
            from: settings.mailer.user,
            to,
            subject: 'Изменение цены на Xiaomi Mi TV Q1 75 в магазине DNS',
            text: '',
            html:
                `
                    <div>
                        <h1>Софтина крутится - чекай скидняк</h1>
                        <p>Цена с рассрочкой сейчас: ${priceWith24}</p>
                        <p>Цена за наличку сейчас: ${price}</p>
                        <a href="${settings.url}">Скорее беги покупать!</a>
                    </div>
                `
        })
    }

    async SendMailWithError (to, error) {
        await this.transporter.sendMail({
            from: settings.mailer.user,
            to,
            subject: 'DNS-PRICE-SCRAPPER ERROR',
            text: '',
            html:
                `
                    <div>
                        <h1>Произошла ошибка</h1>
                        <p>${error}</p>
                    </div>
                `
        })
    }

}

module.exports = new MailService()