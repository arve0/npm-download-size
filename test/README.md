# simple browser testing
This is a minimal setup of testing in chrome headless using

- [puppeteer](https://www.npmjs.com/package/puppeteer/)
- [tape](https://www.npmjs.com/package/tape)
- [tap-dot](https://www.npmjs.com/package/tap-dot) ([patched](https://github.com/arve0/tap-dot/commit/68064386cb4210911f8ad31347bd0f30ce30c8b2) to support stack trace)

It basically

1. Starts a webserver
2. Loads chromium through puppeteer
3. Pipes output from chromium to terminal console
4. Pipes [TAP](https://testanything.org) output through tap-dot

## usage
```sh
git clone https://github.com/arve0/simple-browser-testing browser-tests
rm -fr browser-tests/.git
cd browser-tests
npm install
npm test
```

You should get one test passing and two tests failing:
```sh
$ npm test

> simple-browser-testing@1.0.0 test /Users/arve/git/react-animate-on-change/browser-tests
> node test.js | tap-dot


  .xx


  ---
    operator: fail
    stack: |-
           Error: failing test
             at Test.assert [as _assert] (http://localhost:8888/tape.js:7924:54)
             at Test.bound [as _assert] (http://localhost:8888/tape.js:7776:32)
             at Test.fail (http://localhost:8888/tape.js:8017:10)
             at Test.bound [as fail] (http://localhost:8888/tape.js:7776:32)
             at Test.t (http://localhost:8888/client-tests.js:9:7)
             at Test.bound [as _cb] (http://localhost:8888/tape.js:7776:32)
             at Test.run (http://localhost:8888/tape.js:7795:10)
             at Test.bound [as run] (http://localhost:8888/tape.js:7776:32)
             at next (http://localhost:8888/tape.js:7573:15)
             at onNextTick (http://localhost:8888/tape.js:8431:12)

  ...
  ---
    operator: deepEqual
    expected: |-
      { b: 2 }
    actual: |-
      { a: 1 }
    stack: |-
           Error: should be equivalent
             at Test.assert [as _assert] (http://localhost:8888/tape.js:7924:54)
             at Test.bound [as _assert] (http://localhost:8888/tape.js:7776:32)
             at Test.tapeDeepEqual (http://localhost:8888/tape.js:8121:10)
             at Test.bound [as deepEqual] (http://localhost:8888/tape.js:7776:32)
             at Test.t (http://localhost:8888/client-tests.js:14:7)
             at Test.bound [as _cb] (http://localhost:8888/tape.js:7776:32)
             at Test.run (http://localhost:8888/tape.js:7795:10)
             at Test.bound [as run] (http://localhost:8888/tape.js:7776:32)
             at next (http://localhost:8888/tape.js:7573:15)
             at onNextTick (http://localhost:8888/tape.js:8431:12)

  ...



  3 tests
  1 passed
  2 failed

  Failed Tests:   There were 2 failures

    x failing test
    x should be equivalent

npm ERR! Test failed.  See above for more details.
```

## react
See the [react branch](https://github.com/arve0/simple-browser-testing/tree/react) if you want to test React.

It tries to have a minimal setup with support for JSX through typescript (no webpack, etc).

