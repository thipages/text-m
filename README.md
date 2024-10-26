# text-m

`text-m` is a `block` custom-element using a special syntax for (inline) *Text-level semantic* elements. It wraps the content in one or more paragraphs (`P` tag) elements (many paragraphs if the content is delimited by a more that one newline).

Boolean `level-up` attribute allows to replace a freshly (ghost) `text-m` custom-element by its children allowing to layout those children with former `text-m` siblings

## Syntax

- minimal: `|em/emphasis/`
- with class: `|em.red/emphasis/`
- with default attributes: `|a[mysite.com,_blank]/link text/`
- with named attributes: `|a[#href=mysite.com #target=_blank]/link text/`

## Examples

### Basic
```html
<text-m>
    I must say I |em/adore/ lemonade.
</text-m>
```
transformed to
```html
<text-m>
    <p>I must say I <em>adore</em> lemonade.</p>
</text-m>
```
### With `level-up` attribute
```html
<text-m level-up>
    I must say I |em/adore/ lemonade.

    I must say I |strong/dislike/ lemon.
</text-m>
```
transformed to
```html
    <p>I must say I <em>adore</em> lemonade.</p>
    <p>I must say I <em>dislike</em> lemon.</p>
```

## Supported elements

`a`, `em`, `strong`, `small`, `s`, `cite`, `q`, `dfn`, `abbr`, `code`, `var`, `samp`, `kbd`, `sub`, `sup`, `i`, `b`, `u`, `mark`, `span`

## Non supported elements

`ruby`, `rt`, `rp`, `data`, `time`,`bdo`, `bdi`, `br`, `wbr`

## Default attributes
Three elements support default attributes
- a (href, target): `|a[mysite.com,_blank]/link text/`
- abbr (text): `|abbr[abbreviation description]/abbreviation/`
- dfn (text): `|dfn[definition description]/definition/`








