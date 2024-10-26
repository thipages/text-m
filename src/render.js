import { SLASH, evilChars, testmRegExp, tlsElementsSupported, tlsAttributes } from "./const.js"
export default (input, options={ wrapElement:'p'}) => {
    const {wrapElement} = options
    const _ = input
        .replace(evilChars, '')
        .replace(/</g, '&lt;')
        .replace(/\\\//g, '\x010')
        .replace(testmRegExp, function(original, element, $2, cssClass, $4, attributes, text) {
            let attrs
            if (tlsElementsSupported.includes(element)) {
                attrs = [ 
                    cssClass ? `class="${cssClass}"` : '',
                    ...getHtmlAttributes(element, attributes, '\x011')
                ].join(' ').trim()
                
            }
            // Removed -> Keep text-m simple and do not allow custom-elements -> mark-m
            /*else if (
                element.length > 1 &&
                element.substr(1).includes('-') &&
                !text
            ) {
                // Thats may be a defined custom-element
                attrs = [ 
                    cssClass ? `class="${cssClass}"` : '',
                    ...getHtmlAttributes(element, attributes, '\x011')
                ].join(' ').trim()
            }*/
            return attrs !== undefined
                ? `<${element} ${attrs}>${text}</${element}>`
                : original
        })
        .replace(/\x010/g, SLASH)
        .replace(/\x011/g, ',')
    return addParagraphs(normalizeNewlines(_), wrapElement)
}
function getHtmlAttributes(element, attributes, evilChar) {
    let html=[]
    if (!attributes) return html
    if (attributes.includes('#')) {
        const values = attributes.split(/\s*#([^#]+)/)
            .filter(v=>v)
            .forEach(
                v => {
                    const [a, b] = v.split('=')
                    html.push(`${a}="${b}"`)
                }
            )
    } else {
        const attrs = tlsAttributes[element]
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
    }
    return html
}
function normalizeNewlines(input) {
    
    return input
        .replace(/^\s*\n*/, '') // remove top newlines
        .replace(/\s*\n*$/, '') // remove end newlines
        .replace(/^\s*\n/gm, '\n') // clean newlines
        .replace(/\n{3,}/g, '\n\n') // down to 2 newlines
}
function addParagraphs(input, wrapElement ) {
    const s = input.split('\n\n')
    return wrapElement
        ? s.map(v => wrap(v, wrapElement)).join('\n')
        : input
}
function wrap(content, el) {
    return `<${el}>${content}</${el}>`
}
