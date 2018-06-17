const { start, shutdown } = require('./server')
const { launch, Page } = require('puppeteer')
const it = require('tape')

launch({ devtools: true }).then(async (browser) => {
    await start()
    let page = (await browser.pages())[0]

    page.on('console', async msg => {
        if (msg.type() === 'error') {
            console.error("Browser console.error:")
            let error = await msg.args()[0].jsonValue()
            console.error(error)
        } else {
            console.log(msg._text)
        }
    })

    let mainPage = 'http://localhost:8888/client-tests.html'

    await page.goto(mainPage)

    it('should have an input element', async t => {
        let input = await page.$('input')
        t.notEqual(input, null)
        t.end()
    })

    it('should find the async package', async t => {
        let input = await page.$('input')
        await input.type('async')
        await sleep(300)
        await input.press('Enter')

        await page.waitFor('h1.link')

        let npmLink = await page.$eval('h1.link', link => link.textContent)

        t.equal(npmLink, 'async')
        t.end()
    })

    it('should find async also with suggestion list', async t => {
        await page.goto(mainPage)
        let input = await page.$('input')
        await input.type('async')
        await page.waitFor('.v-autocomplete-item-active')
        await input.press('Enter')

        await page.waitFor('h1.link')

        let npmLink = await page.$eval('h1.link', link => link.textContent)

        t.equal(npmLink, 'async')
        t.end()
    })

    it('should use the suggestion list as package name', async t => {
        await page.goto(mainPage)
        let input = await page.$('input')
        await input.type('async')
        await page.waitFor('.v-autocomplete-item-active')
        await input.press('ArrowDown')
        await input.press('Enter')

        await page.waitFor('h1.link')

        let npmLink = await page.$eval('h1.link', link => link.textContent)

        t.notEqual(npmLink, 'async')
        t.end()
    })

    // wait for tests to end
    await onFinish()

    browser.close()
    shutdown()
})

function sleep (time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

function onFinish () {
    return new Promise((resolve, reject) => {
        it.onFinish(resolve)
    })
}