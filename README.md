# text-m

`text-m` is a `block` custom-element using a special syntax for (inline) *Text-level semantic* elements.

It wraps the content in one or more paragraphs (`P` tag) elements.

Boolean `level-up` attribute allows to replace a fresh `text-m` custom-element by its children allowing to layout those children with former `text-m` siblings

## Syntax

- minimal: `|em/emphasis/`
- with class: `|em.red/emphasis/`
- with shotcuts attributes: `|a[mysite.com,_blank]/link text/`
- with named attributes: `|a[#href=mysite.com #target=_blank]/link text/`

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
    <p>I must say I <em>dislike</em> lemon.</p>
```

## Supported elements

`a`, `em`, `strong`, `small`, `s`, `cite`, `q`, `dfn`, `abbr`, `code`, `var`, `samp`, `kbd`, `sub`, `sup`, `i`, `b`, `u`, `mark`, `span`

## Non supported elements

`ruby`, `rt`, `rp`, `data`, `time`,`bdo`, `bdi`, `br`, `wbr`

## Shortcuts attributes
Three elements support shortcuts attributes
- a (href, target): `|a[mysite.com,_blank]/link text/`
- abbr (text): `|abbr[abbreviation description]/abbreviation/`
- dfn (text): `|dfn[definition description]/definition/`








