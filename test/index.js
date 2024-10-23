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
    ['/em:text/', 0],
    ['/em:text/\n', 0],
    ['\n/em:text/', 0],
    ['\n/em:text/\n', 0],
    ['before/em:text/after', 0],
    ['/em.class:text/', 1],
    ['/em[attrs]:text/', 2],
    ['/em.class[attrs]:text/', 3],
    ['/random.class[attrs]:text/', 4]
]
tests1.forEach(
    (test, i) => {
        const [, element, , cssClass, , attributes, text] = [... test[0].matchAll(testmRegExp)][0]
        const observed = [element, cssClass, attributes, text]
        assert.deepEqual(test1Expected[test[1]], observed)
        
    }
)

const r = render([
    '/em.red:Hello/', 
    '/a[google.com, _blank]:Hello/',
    '/abbr[with escaped comma \\,]:Hello/',
    '/em.red:Hello/\\/<', // special characters / and <
    '\n\n/em.red:Hello/\nj\n\nem.blue:Hello/'

].join('\n'))
console.log(r)