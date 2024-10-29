import assert from 'node:assert'
import {test, describe} from 'node:test'
import { htmlTests, htmlTests_wrapOneChild } from "./tests-list.js";
import render from '../src/render/index.js'

describe('test-m, wrapOneChild=true', () => {
    for (const htmlTest of htmlTests) {
        const [description, input, regexIndexExpected, htmlExpected] = htmlTest
        if (htmlExpected) {
            test(description, () => {
                assert.equal(render(input), htmlExpected)
            })
        }
    }
})
describe('test-m, wrapOneChild=false', () => {
    for (const htmlTest of htmlTests_wrapOneChild) {
        const [description, input, regexIndexExpected, htmlExpected] = htmlTest
        if (htmlExpected) {
            test(description, () => {
                assert.equal(render(input, {wrapOne: false}), htmlExpected)
            })
        }
    }
})

