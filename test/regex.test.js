import { testmRegExp } from "../src/render/const.js"
import assert from 'node:assert'
import {test, describe} from 'node:test'
import { regexTests, regexTestsExpected } from "./tests-list.js";

describe('test-m regex tests', () => {
    for (const [description, input, regexIndexExpected, htmlExpected] of regexTests) {
        test(description, () => {
            const match = [...input.matchAll(testmRegExp)]
            if (match.length !== 0) {
                const [, element, , cssClass, , attributes, text] = match[0]
                const observed = [element, cssClass, attributes, text]
                assert.deepEqual(regexTestsExpected[regexIndexExpected], observed)
            } else {
                assert.fail('no regex match')
            }
          })
    }
})
