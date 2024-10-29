# text-m

`text-m` is a `block` custom-element for text content
- using a special syntax for (inline) [Text-level semantic elements](https://html.spec.whatwg.org/multipage/text-level-semantics.html),
- wrapping the content in one or more paragraphs (`P` tag) elements,
- allowing `text-m` to be replaced by its children using the boolean `level-up` attribute.

## Syntax

- minimal: `|em/emphasis/`
- with class: `|em.red/emphasis/`
- with shortcuts attributes: `|a[mysite.com _blank]/link text/` (space delimiter)
- with named attributes: `|a[href="mysite.com" target="_blank"]/link text/`(as regular attributes)
- class and attributes can be mixed: `|a.red[mysite.com]/link text/` 

## Examples

### Basic
```html
<text-m>
    I must say I |em/adore/ lemonade.
    Love it!
</text-m>
```
transformed to
```html
<text-m>
    <p>I must say I <em>adore</em> lemonade. Love it!</p>
</text-m>
```
### With `level-up` attribute
```html
<text-m level-up>
    I must say I |em/adore/ lemonade.

    I must say I |strong/dislike/ celery.
</text-m>
```
transformed to
```html
    <p>I must say I <em>adore</em> lemonade.</p>
    <p>I must say I <em>dislike</em> celery.</p>
```
## Installation

`npm i @titsoft/text-m`

```javascript
// Create text-m custom-element
import {} from '@titsoft/text-m'
//  + access to text-m renderer
import {render} from '@titsoft/text-m/render'
render(input, options) // default: options = {wrapOne: true}
// wrapOne : wrap or not with P tag if there is only one paragraph
```

## Supported elements

`a`, `em`, `strong`, `small`, `s`, `cite`, `q`, `dfn`, `abbr`, `code`, `var`, `samp`, `kbd`, `sub`, `sup`, `i`, `b`, `u`, `mark`, `span`

## Non supported elements

`ruby`, `rt`, `rp`, `data`, `time`,`bdo`, `bdi`, `br`, `wbr`

## Shortcuts attributes
Three elements support shortcuts attributes (order is important, second argument is optional, `a` attributes are space delimited)
- a[href target]: `|a[mysite.com _blank]/link text/`
- abbr[text]: `|abbr[abbreviation description]/abbreviation/`
- dfn[text]: `|dfn[definition description]/definition/`

## Named attributes

- Named attributes are written as regular HTML attributes with quotes.

`|a[href="mysite.com" target="_blank"]/link text/`

- Named class attribute has precedence over the element modifier syntax (eg `em.red`)

`em.red[class="blue"]/Hello/`











