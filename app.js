const puppeteer = require('puppeteer')
const MinimalMongodb = require('MinimalMongodb')
const settings = require("./settings");
const mailService = require('./service/mailService')
const log = require('./utils/log')

const dnsProduct = settings.url

async function scrapper() {
    const dbConnector = new MinimalMongodb(settings.dbSettings)
    const mdb = await dbConnector.connect()

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '- disable-setuid-sandbox'] // Помогает при запуске через systemd
    })
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3738.0 Safari/537.36')
    await page.goto(dnsProduct)
    await page.waitForSelector('div.product-card-top.product-card-top_full > div.product-card-top__buy > div.product-buy.product-buy_one-line > div > div.product-buy__price.product-buy__price_active')
    const dualPrice = await page.$eval('div.product-card-top.product-card-top_full > div.product-card-top__buy > div.product-buy.product-buy_one-line > div > div.product-buy__price.product-buy__price_active', el => el.innerText)
    let priceWith24 = dualPrice.split('₽')[1]
    priceWith24 = priceWith24.replace(/\s+/g, '')

    let price = dualPrice.split('₽')[0]
    price = price.replace(/\s+/g, '')

    if (priceWith24 || price) {
        await mdb.collection('checkPrice').insertOne({
            date: new Date(),
            priceWith24: priceWith24,
            price: price
        })
    }

    const countDocuments = await mdb.collection('checkPrice').find().count()
    if (countDocuments && countDocuments > 1) {
        const lastPrices = await mdb.collection('checkPrice').find({}).sort({_id: -1}).limit(2).toArray()

        if (lastPrices[0].price !== lastPrices[1].price || lastPrices[0].priceWith24 !== lastPrices[1].priceWith24) {
            await mailService.sendMail(settings.sendTo,
                lastPrices[0].price,
                lastPrices[0].priceWith24,
                lastPrices[1].price,
                lastPrices[1].priceWith24)
            log(`Message has been sent to ${settings.sendTo}`)
        } else {
            log('The price has not changed')
        }
    }


    await browser.close()

    dbConnector.client.close()
}

scrapper().then(() => {
    process.exit(0)
}).catch((err) => {
    console.log('Error:', err.toString())
    mailService.SendMailWithError(settings.sendTo, err.toString()).then(r => console.log(r))
    process.exit(1)
})