import { SLASH, PIPE, evilChars, testmRegExp, tlsElementsSupported, tlsAttributes } from "./const.js"
const defaultOptions = { wrapOne: true}
export default (input, options = {}) => {
    const {wrapOne} = Object.assign({}, defaultOptions, options)
    const _ = input
        .replace ('<', '&lt;')
        .replace(evilChars, '')     // clean placeholders
        .replace(/\\\//g, '\x010')  // reserve escaped slash
        .replace(/\\\|/g, '\x011')  // reserve escaped pipe
        .replace(testmRegExp, function(original, element, $2, cssClass, $4, attributes, text) {
            if (tlsElementsSupported.includes(element)) {
                const htmlAttributes = getHtmlAttributes(element, attributes)
                const hasClass = /class\s*="/.test(htmlAttributes)
                const attrs = hasClass
                    ? htmlAttributes
                    : [
                        cssClass ? `class="${cssClass}"` : '',
                        htmlAttributes
                      ].join(' ').trim()
                const sAttr = attrs ==='' ? '' : ' ' + attrs
                return `<${element}${sAttr}>${text.trim()}</${element}>`
            } else {
                return original
            }
        })
        .replace(/\x010/g, SLASH)
        .replace(/\x011/g, PIPE)

    return addParagraphs(normalizeNewlines(_), wrapOne)
}
function getHtmlAttributes(element, attributes) {
    if (!attributes) return ''
    const isRegular = /[a-z-]+="/.test(attributes)
    if (isRegular) {
        return attributes
    } else {
        // shortcut attribute for a small set of elements
        const [delimiter, ...attrs] = tlsAttributes[element]
        // Check for a supported TLS element attribute
        if (attrs) {
            const values = attributes
                .trim()
                .replace(/\s{2,}/g, ' ')
                // DEV: string.split(undefined) gives [string]
                .split(delimiter)
                return attrs.map (
                    (attr, index) => values[index] ? `${attr}="${values[index]}"` : null
                )
                .filter(v => v)
                .join(" ")
        } else {
            return ''
        }
    }
}
function normalizeNewlines(input) {
    return input
        .replace(/^\s*\n/gm, '\n') // clean newlines
        .replace(/^\n+/, '') // remove top newlines
        .replace(/\n+$/, '') // remove end newlines
        .replace(/\n{3,}/g, '\n\n') // down to 2 newlines for paragraphs
}
function addParagraphs(input, wrapOneChild ) {
    const s = input.split('\n\n')
    return (s.length === 1 && !wrapOneChild)
        ? input.trim()
        : s.map(v => wrap(v, 'p')).join('\n')
}
function wrap(content, el, attributes) {
    return `<${el}>${content.trim()}</${el}>`
}
