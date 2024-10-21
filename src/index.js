import { render as downaRender } from "./downa.js"
import {renderExtraRules} from './downa-extra.js'
export { render, renderExtraRules, downaRender }

const linksRe = /\[([^[]+)\]\(([^)]+)\)/gmi;

const
    evilChars = /\x01(\d)/g,
    // https://stackoverflow.com/questions/59515074/z-pcre-equivalent-in-javascript-regex-to-match-all-markdown-list-items
    lists = /^(?:\d+\.|[*+-]) .*(?:\r?\n(?!(?:\d+\.|[*+-]) ).*)*/gm,
    special = /\/(.+)(:\..+|:)(.+)\//g,
    url = /(^|\s)([a-z]{2,}:\/\/[^\s/$.?#-]+\.\S+)/g

const extraRules = {
    tbd: {
        regex: /\/(.+)(:.+){0,1}(.+)\//g,
        replacer: function(match, $1, $2){
            const h = $1.trim().length;
            return `<h${h}>${$2.trim()}</h${h}>`;
        }
    }
}
function render(markdown) {
    return renderExtraRules(markdown, extraRules)
}

