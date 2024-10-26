// tls = Text-level semantics, see https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-dfn-element
export const tlsElementsSupported = [
    'a', 'em', 'strong', 'small', 's', 'cite', 'q',
    'dfn', 'abbr', 'code', 'var', 'samp', 'kbd',
    'sub', 'sup', 'i', 'b', 'u', 'mark', 'span'
]
export const tlsElementsNotSupported = [
    'ruby', 'rt', 'rp', 'data', 'time',
    'bdo', 'bdi', 'br', 'wbr'
]
export const tlsAttributes = {
    a: ['href', 'target'],
    abbr: ['title'],
    dfn: ['title']
}
export const evilChars = /\x01(\d)/g
// "/(element)?.(class)??[attributes]?:text/"
export const testmRegExp = /\|([a-z][a-z0-9]*)(\.([^\[\/]*)){0,1}(\[(.*)\]){0,1}\/([^\/]+)\//gi
export const SLASH = '&#x2F;'