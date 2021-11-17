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

    async sendMail (to, price, priceWith24, oldPrice, oldPriceWith24) {
        await this.transporter.sendMail({
            from: settings.mailer.user,
            to,
            subject: 'Изменение цены на Xiaomi Mi TV Q1 75 в магазине DNS',
            text: '',
            html:
                `
                   <div>
                       <h1>Цена на Xiaomi Mi TV Q1 75 изменилась!</h1>
                       <p style="font-size: 20px">Предложение СЕГОДНЯ: <b style="color: red">Наличка - ${price}, Рассрочка - ${priceWith24}</b></p>
                       <hr />
                       <p style="font-size: 17px">Старая цена: <b style="color: #23299e">Наличка - ${oldPrice}, Рассрочка - ${oldPriceWith24}</b></p>
                       <hr />
                       <a href="${settings.url}" style="font-size: 22px">Ссылка на товар!</a>
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
                       <h1>Произошла ошибка! :(</h1>
                       <hr />
                       <p style="font-size: 20px">ERROR MESSAGE: <b style="color: red">${error}</b></p>
                       <hr />
                   </div>
                `
        })
    }

}

module.exports = new MailService()