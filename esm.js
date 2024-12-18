// tls = Text-level semantics, see https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-dfn-element
const tlsElementsSupported = [
    'a', 'em', 'strong', 'small', 's', 'cite', 'q',
    'dfn', 'abbr', 'code', 'var', 'samp', 'kbd',
    'sub', 'sup', 'i', 'b', 'u', 'mark', 'span'
];
// properties are made of [delimiter, ... attributes]
const tlsAttributes = {
    a: [' ', 'href', 'target'],
    abbr: [, 'title'],
    dfn: [, 'title']
};
const evilChars = /\x01(\d)/g;
// pattern : |element[.class][[attributes]]/text/
const testmRegExp = /\|([a-z][a-z0-9]*)(\.([^\[\/]*)){0,1}(\[(.*)\]){0,1}\/([^\/]+)\//gi;
const SLASH = '&#x2F;';
const PIPE = '&#124;';

const defaultOptions = { wrapOne: true};
var render = (input, options = {}) => {
    const {wrapOne} = Object.assign({}, defaultOptions, options);
    const _ = input
        .replace ('<', '&lt;')
        .replace(evilChars, '')     // clean placeholders
        .replace(/\\\//g, '\x010')  // reserve escaped slash
        .replace(/\\\|/g, '\x011')  // reserve escaped pipe
        .replace(testmRegExp, function(original, element, $2, cssClass, $4, attributes, text) {
            if (tlsElementsSupported.includes(element)) {
                const htmlAttributes = getHtmlAttributes(element, attributes);
                const hasClass = /class\s*="/.test(htmlAttributes);
                const attrs = hasClass
                    ? htmlAttributes
                    : [
                        cssClass ? `class="${cssClass}"` : '',
                        htmlAttributes
                      ].join(' ').trim();
                const sAttr = attrs ==='' ? '' : ' ' + attrs;
                return `<${element}${sAttr}>${text.trim()}</${element}>`
            } else {
                return original
            }
        })
        .replace(/\x010/g, SLASH)
        .replace(/\x011/g, PIPE);

    return addParagraphs(normalizeNewlines(_), wrapOne)
};
function getHtmlAttributes(element, attributes) {
    if (!attributes) return ''
    const isRegular = /[a-z-]+="/.test(attributes);
    if (isRegular) {
        return attributes
    } else {
        // shortcut attribute for a small set of elements
        const [delimiter, ...attrs] = tlsAttributes[element];
        // Check for a supported TLS element attribute
        if (attrs) {
            const values = attributes
                .trim()
                .replace(/\s{2,}/g, ' ')
                // DEV: string.split(undefined) gives [string]
                .split(delimiter);
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
    const s = input.split('\n\n');
    return (s.length === 1 && !wrapOneChild)
        ? input.trim()
        : s.map(v => wrap(v, 'p')).join('\n')
}
function wrap(content, el, attributes) {
    return `<${el}>${content.trim()}</${el}>`
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

const LEVEL_UP = 'level-up';
const isAsyncFunction = fn => fn.constructor.name === 'AsyncFunction';
class MElement extends HTMLParsedElement {
    #config
    #fragment
    constructor(config) {
        super();
        this.#config = config || {};
    }
    #content(remove, textOnly) {
        const _ = this.#fragment;
        if (!_) return
        if (remove) this.#fragment = null;
        return textOnly ?  _.textContent : _
    }
    #finish (that) {
        if (that.hasAttribute(LEVEL_UP)) {
            that.replaceWith(...that.children);
        }
        that.dispatchEvent(new Event('load'));
        that.lodaed = true;
    }
    originalFragment(remove = true) {
        return this.#content(remove, false)
    }
    originalText(remove = true) {
        return this.#content(remove, true)
    }
    parsedCallback() {
        const end = () => this.#finish(this);
        // move childNodes to a fragment
        this.#fragment = document.createDocumentFragment();
        this.#fragment.append(...this.childNodes);
        // add onLoadHtml
        this.innerHTML = this.#config.onLoadHtml || '';
        // manage async/sync init function
        if (this.init) {
            if (isAsyncFunction(this.init)) {
                this.init().then(end);
            } else {
                this.init();
                end();
            } 
        } else {
            end();
        }   
              
    }
}

const def = { name: 'text-m' };
function define(options) {
    const {name, render} = Object.assign(options, def);
    customElements.define(name,
        class extends MElement {
            constructor() { super(); }
            init() {
                this.innerHTML = render(this.originalText());
            }
        }
    );
}

define({render});

export { define };
