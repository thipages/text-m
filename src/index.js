import { SLASH, evilChars, testmRegExp, tlsElementsSupported, tlsAttributes } from "./const.js"
export { render }
function render(input) {
    const _ = input
        .replace(evilChars, '')
        .replace(/</g, '&lt;')
        .replace(/\\\//g, '\x010')
        .replace(testmRegExp, function(original, element, $2, cssClass, $4, attributes, text) {
            if (tlsElementsSupported.includes(element)) {
                const attrs = [ 
                    cssClass ? `class="${cssClass}"` : '',
                    ...getHtmlAttributes(element,attributes, '\x011')
                ].join(' ').trim()
                return `<${element} ${attrs}>${text}</${element}>`
            }
            return original
        })
        .replace(/\x010/g, SLASH)
        .replace(/\x011/g, ',')
    return addParagraphs(normalizeNewlines(_))
}
function getHtmlAttributes(element, attributes, evilChar) {
    const attrs = tlsAttributes[element]
    let html=[]
    if (attrs) {
        const values = attributes
            .replace(/\\,/g, evilChar)
            .split(',').map(v => v.trim())
        for (const [index, attr] of attrs.entries()) {
            if (values[index]) {
                html.push(`${attr}="${values[index]}"`)
            }
        }
    }
    return html
}
function normalizeNewlines(input) {
    return input
        .replace(/^\s*\n*/, '') // remove top newlines
        .replace(/\s*\n*$/, '') // remove end newlines
        .replace(/^\s*\n/g, '\n') // clean newlines
        .replace(/\n+/g, '\n') // down to mono newlines
}
function addParagraphs(input) {
    return input.split('\n').map(v => wrap(v)).join('\n')
}
function wrap(content, el='p') {
    return `<${el}>${content}</${el}>`
}
