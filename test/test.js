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

        await page.waitFor('.package h1')

        let npmLink = await page.$eval('.package h1', link => link.textContent)

        t.true(npmLink.includes('async'))
        t.end()
    })

    it('should find async also with suggestion list', async t => {
        await page.goto(mainPage)
        let input = await page.$('input')
        await input.type('async')
        await page.waitFor('.v-autocomplete-item-active')
        await input.press('Enter')

        await page.waitFor('.package h1')

        let npmLink = await page.$eval('.package h1', link => link.textContent)

        t.true(npmLink.includes('async'))
        t.end()
    })

    it('should use the suggestion list as package name', async t => {
        await page.goto(mainPage)
        let input = await page.$('input')
        await input.type('async')
        await page.waitFor('.v-autocomplete-item-active')
        await input.press('ArrowDown')
        await input.press('Enter')

        await page.waitFor('.package h1')

        let npmLink = await page.$eval('.package h1', link => link.textContent)

        t.false(npmLink.indexOf('async @') === 0)
        t.end()
    })

    it('should find packages with two letters', async t => {
        await page.goto(mainPage)
        let input = await page.$('input')
        await input.type('he')

        let firstSearchResult = '.v-autocomplete-list > :nth-child(1) > span'
        await page.waitFor(firstSearchResult)
        let npmLink = await page.$eval(firstSearchResult, span => span.textContent)

        t.true(npmLink.includes('he'))
        t.end()
    })

    it('should sort depreciated packages last', async t => {
        await page.goto(mainPage)
        let input = await page.$('input')
        await input.type('npm')

        let firstSearchResult = '.v-autocomplete-list > :nth-child(1) > span'
        await page.waitFor(firstSearchResult)
        let first = await page.$eval(firstSearchResult, span => span.textContent)

        t.equal(first, 'npm')
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