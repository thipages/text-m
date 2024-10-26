import render from './render.js'
import HTMLParsedElement from 'html-parsed-element'
customElements.define(
    'text-m', class extends HTMLParsedElement {
        constructor() { super() }
        connectedCallback() {
            this.innerHTML = render(this.textContent)
            // DEV: need to add setTimeout otherwise the node dies with its children
            if (this.hasAttribute('level-up')) {
                setTimeout(() => this.replaceWith(...this.children))
            }
        }
    }
)