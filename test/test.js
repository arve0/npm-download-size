const { start, shutdown } = require('./server')
const { launch } = require('puppeteer')
const assert = require('assert');

let port = 8888
let mainPage = `http://localhost:${port}/`
let browser = null
let page = null

before(() => launch({ devtools: true }).then(async (b) => {
    browser = b
    await start(port)
    page = (await browser.pages())[0]

    page.on('console', async msg => {
        if (msg.type() === 'error') {
            console.error("Browser console.error:")
            let error = await msg.args()[0].jsonValue()
            console.error(error)
        } else {
            console.log(msg._text)
        }
    })
}))

beforeEach(async () => await page.goto(mainPage))

after(() => {
    browser.close()
    shutdown()
})

it('should have an input element', async () => {
    let input = await page.$('input')

    assert.notEqual(input, null)
})

it('should find the async package', async () => {
    let input = await page.$('input')
    await input.type('async')
    await sleep(300)
    await input.press('Enter')

    await page.waitFor('.package h1')

    let npmLink = await page.$eval('.package h1', link => link.textContent)

    assert(npmLink.includes('async'))
 })

it('should find async also with suggestion list', async () => {
    let input = await page.$('input')
    await input.type('async')
    await page.waitFor('.v-autocomplete-item-active')
    await input.press('Enter')

    await page.waitFor('.package h1')

    let npmLink = await page.$eval('.package h1', link => link.textContent)

    assert(npmLink.includes('async'))
})

it('should use the suggestion list as package name', async () => {
    let input = await page.$('input')
    await input.type('async')
    await page.waitFor('.v-autocomplete-item-active')
    await input.press('ArrowDown')
    await input.press('Enter')

    await page.waitFor('.package h1')

    let npmLink = await page.$eval('.package h1', link => link.textContent)

    assert(npmLink.indexOf('async @') !== 0)
})

it('should find packages with two letters', async () => {
    let input = await page.$('input')
    await input.type('he')

    let firstSearchResult = '.v-autocomplete-list > :nth-child(1) > span'
    await page.waitFor(firstSearchResult)
    let npmLink = await page.$eval(firstSearchResult, span => span.textContent)

    assert(npmLink.includes('he'))
})

it('should sort depreciated packages last', async () => {
    let input = await page.$('input')
    await input.type('npm')

    let firstSearchResult = '.v-autocomplete-list > :nth-child(1) > span'
    await page.waitFor(firstSearchResult)
    let first = await page.$eval(firstSearchResult, span => span.textContent)

    assert.equal(first, 'npm')
})

function sleep (time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

