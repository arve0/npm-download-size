# simple browser testing
This is a dead simple setup of end-to-end testing with chrome headless using

- [puppeteer](https://www.npmjs.com/package/puppeteer/) and
- [mocha](https://www.npmjs.com/package/mocha).

It basically

1. Starts a webserver
2. Loads chromium through puppeteer
4. Runs tests with mocha

## usage
Write tests in test.js and start with

```sh
$ npm test

> simple-browser-testing@1.0.0 test /Users/arve/git/npm-download-size/test
> mocha test.js



  ✓ should have an input element
  ✓ should find the async package (730ms)
  ✓ should find async also with suggestion list (604ms)
  ✓ should use the suggestion list as package name (561ms)
  ✓ should find packages with two letters (522ms)
  ✓ should sort depreciated packages last (490ms)

  6 passing (4s)

```
