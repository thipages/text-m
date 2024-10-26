// tls = Text-level semantics, see https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-dfn-element
const tlsElementsSupported = [
    'a', 'em', 'strong', 'small', 's', 'cite', 'q',
    'dfn', 'abbr', 'code', 'var', 'samp', 'kbd',
    'sub', 'sup', 'i', 'b', 'u', 'mark', 'span'
];
const tlsAttributes = {
    a: ['href', 'target'],
    abbr: ['title'],
    dfn: ['title']
};
const evilChars = /\x01(\d)/g;
// "/(element)?.(class)??[attributes]?:text/"
const testmRegExp = /\|([a-z][a-z0-9]*)(\.([^\[\/]*)){0,1}(\[(.*)\]){0,1}\/([^\/]+)\//gi;
const SLASH = '&#x2F;';

var render = (input, options={ wrapElement:'p'}) => {
    const {wrapElement} = options;
    const _ = input
        .replace(evilChars, '')
        .replace(/</g, '&lt;')
        .replace(/\\\//g, '\x010')
        .replace(testmRegExp, function(original, element, $2, cssClass, $4, attributes, text) {
            let attrs;
            if (tlsElementsSupported.includes(element)) {
                attrs = [ 
                    cssClass ? `class="${cssClass}"` : '',
                    ...getHtmlAttributes(element, attributes, '\x011')
                ].join(' ').trim();
                
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
        .replace(/\x011/g, ',');
    return addParagraphs(normalizeNewlines(_), wrapElement)
};
function getHtmlAttributes(element, attributes, evilChar) {
    let html=[];
    if (!attributes) return html
    if (attributes.includes('#')) {
        attributes.split(/\s*#([^#]+)/)
            .filter(v=>v)
            .forEach(
                v => {
                    const [a, b] = v.split('=');
                    html.push(`${a}="${b}"`);
                }
            );
    } else {
        const attrs = tlsAttributes[element];
        if (attrs) {
            const values = attributes
                .replace(/\\,/g, evilChar)
                .split(',').map(v => v.trim());
            for (const [index, attr] of attrs.entries()) {
                if (values[index]) {
                    html.push(`${attr}="${values[index]}"`);
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
    const s = input.split('\n\n');
    return wrapElement
        ? s.map(v => wrap(v, wrapElement)).join('\n')
        : input
}
function wrap(content, el) {
    return `<${el}>${content}</${el}>`
}

/*! (c) Andrea Giammarchi - ISC */
const HTMLParsedElement = (() => {
  const DCL = 'DOMContentLoaded';
  const init = new WeakMap;
  const queue = [];
  const isParsed = el => {
    do {
      if (el.nextSibling)
        return true;
    } while (el = el.parentNode);
    return false;
  };
  const upgrade = () => {
    queue.splice(0).forEach(info => {
      if (init.get(info[0]) !== true) {
        init.set(info[0], true);
        info[0][info[1]]();
      }
    });
  };
  document.addEventListener(DCL, upgrade);
  class HTMLParsedElement extends HTMLElement {
    static withParsedCallback(Class, name = 'parsed') {
      const {prototype} = Class;
      const {connectedCallback} = prototype;
      const method = name + 'Callback';
      const cleanUp = (el, observer, ownerDocument, onDCL) => {
        observer.disconnect();
        ownerDocument.removeEventListener(DCL, onDCL);
        parsedCallback(el);
      };
      const parsedCallback = el => {
        if (!queue.length)
          requestAnimationFrame(upgrade);
        queue.push([el, method]);
      };
      Object.defineProperties(
        prototype,
        {
          connectedCallback: {
            configurable: true,
            writable: true,
            value() {
              if (connectedCallback)
                connectedCallback.apply(this, arguments);
              if (method in this && !init.has(this)) {
                const self = this;
                const {ownerDocument} = self;
                init.set(self, false);
                if (ownerDocument.readyState === 'complete' || isParsed(self))
                  parsedCallback(self);
                else {
                  const onDCL = () => cleanUp(self, observer, ownerDocument, onDCL);
                  ownerDocument.addEventListener(DCL, onDCL);
                  const observer = new MutationObserver(() => {
                    /* istanbul ignore else */
                    if (isParsed(self))
                      cleanUp(self, observer, ownerDocument, onDCL);
                  });
                  observer.observe(self.parentNode, {childList: true, subtree: true});
                }
              }
            }
          },
          [name]: {
            configurable: true,
            get() {
              return init.get(this) === true;
            }
          }
        }
      );
      return Class;
    }
  }
  return HTMLParsedElement.withParsedCallback(HTMLParsedElement);
})();

customElements.define(
    'text-m', class extends HTMLParsedElement {
        constructor() { super(); }
        connectedCallback() {
            this.innerHTML = render(this.textContent);
            // DEV: need to add setTimeout otherwise the node dies with its children
            if (this.hasAttribute('level-up')) {
                setTimeout(() => this.replaceWith(...this.children));
            }
        }
    }
);

export { render };
