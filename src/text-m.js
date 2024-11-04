import MElement from '@titsoft/m-element'
const def = { name: 'text-m' }
export function define(options) {
    const {name, render} = Object.assign(options, def)
    customElements.define(
        name, class extends MElement {
            constructor() { super() }
            init() {
                this.innerHTML = render(this.textContent)
            }
        }
    )
}