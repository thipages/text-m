import assert from 'node:assert'
import {test, describe} from 'node:test'
import { htmlTests } from "./tests-list.js";
import render from './../src/render.js'

describe('test-m html tests', () => {
    for (const htmlTest of htmlTests) {
        const [description, input, regexIndexExpected, htmlExpected] = htmlTest
        if (htmlExpected) {
            test(description, () => {
                assert.equal(render(input), htmlExpected)
            })
        }
    }
})

