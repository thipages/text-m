import { render as downaRender } from "./downa.js"
export function renderExtraRules(markdown, extraRules) {
    let toHtml = extractEscapes(markdown)
    [toHtml, escapes] = render(toHtml)
    Object.keys(extraRules).forEach((key) => {
        toHtml = toHtml.replace(extraRules[key].regex, extraRules[key].replacer)
    });
    return resumeEscapes(toHtml.trim(), escapes)
}
function extractEscapes(markdown) {
    const withoutEscapesMardown = '' + markdown
    const escapes= []
    return [withoutEscapesMardown, escapes]
}
function resumeEscapes(markdown, escapes) {
    return '' + markdown
}