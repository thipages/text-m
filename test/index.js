import { testmRegExp } from "../src/const.js"
import render from "../src/render.js"
import assert from 'node:assert'
const test1Expected = [
    ['em', undefined , undefined,'text'],
    ['em', 'class', undefined,'text'],
    ['em', undefined, 'attrs','text'],
    ['em', 'class', 'attrs' ,'text'],
    ['random', 'class', 'attrs' ,'text'],
]
const tests1 = [
    ['|em/text/', 0],
    ['|em/text/\n', 0],
    ['\n|em/text/', 0],
    ['\n|em/text/\n', 0],
    ['before|em/text/after', 0],
    ['|em.class/text/', 1],
    ['|em[attrs]/text/', 2],
    ['|em.class[attrs]/text/', 3],
    ['|random.class[attrs]/text/', 4]
]
const tests2 = [
    ['|em/text/\n\n|em/text/', '<p><em>text</em></p><p><em>text</em></p>'],
]
tests1.forEach(
    (test, i) => {
        const match = [...test[0].matchAll(testmRegExp)]
        if (match.length !== 0) {
            const [, element, , cssClass, , attributes, text] = match[0]
            const observed = [element, cssClass, attributes, text]
            assert.deepEqual(test1Expected[test[1]], observed)
        } else {
            console.log('error ' + test[0])
        }
        
    }
)
const tests = [
    'before|em/text/after\n\n|em/text/',
    '|em/text/\n\n/em/text/',
    '|em/Hello/', 
    '|em.red/Hello/', 
    '|a[google.com, _blank]/Hello/',
    '|abbr[with escaped comma \\,]/Hello/',
    '|em.red/Hello/\\/<', // special characters / and <
    '\n\n|em.red/Hello/\nj\n\n|em.blue/Hello/',
    '|a-ce[#test=1#test2=foo]//'
]
const res = tests.map(v=>render(v)) 
console.log(res)