import HTMLParsedElement from 'html-parsed-element'
const def = { name: 'text-m' }
export function define(options) {
    const {name, render} = Object.assign(options, def)
    customElements.define(
        name, class extends HTMLParsedElement {
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
}