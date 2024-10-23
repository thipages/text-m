import render from './render.js'
customElements.define(
    'text-m', class extends HTMLElement {
        constructor() { super() }
        connectedCallback() {
            this.innerHTML = render(this.textContent)
        }
    }
)