export const regexTestsExpected = [
    ['em', undefined , undefined,'text'],
    ['em', 'class', undefined,'text'],
    ['em', undefined, 'attrs','text'],
    ['em', 'class', 'attrs' ,'text'],
    ['random', 'class', 'attrs' ,'text'],
]
export const regexTests = [
    ['base', '|em/text/', 0, '<p><em>text</em></p>'],
    ['with ending newline', '|em/text/\n', 0,'<p><em>text</em></p>'],
    ['with leading newline','\n|em/text/', 0, '<p><em>text</em></p>'],
    ['with leading and ending newline','\n|em/text/\n', 0, '<p><em>text</em></p>'],
    ['with leading and ending text','before|em/text/after', 0, '<p>before<em>text</em>after</p>'],
    ['with class','|em.class/text/', 1, '<p><em class="class">text</em></p>'],
    ['with attrs','|em[attrs]/text/', 2, undefined],
    ['with class and attrs','|em.class[attrs]/text/', 3, undefined],
    ['with a non Text-level semantic element','|random.class[attrs]/text/', 4,  undefined]
]
export const htmlTests = [
    ['1 and 2 newlines', 'before|em/text/after\n\n|em/text/\nafter2', ,'<p>before<em>text</em>after</p>\n<p><em>text</em>\nafter2</p>'], 
    ['"a" element with shortcuts attributes', '|a[google.com _blank]/Hello/', , '<p><a href="google.com" target="_blank">Hello</a></p>'],
    ['"abbr" element with spaced title', '|abbr[abbreviation with spaces]/Hello/', , '<p><abbr title="abbreviation with spaces">Hello</abbr></p>'],
    ['"a" element with attributes', '|a[href="google.com" target="_blank"]/Hello/', , '<p><a href="google.com" target="_blank">Hello</a></p>'],
    ['class defined twice', '|em.red[class="blue bordered"]/Hello/', , '<p><em class="blue bordered">Hello</em></p>'],
    ['text trimmed', '|em/Hello/|em/  tit/', , '<p><em>Hello</em><em>tit</em></p>'],
    ... regexTests
]
export const htmlTests_wrapOneChild = [
    ['OneWrap option - one paragraph', '|em/text/', ,'<em>text</em>'], 
    ['OneWrap option - multiple paragraphs', '|em/text1/\n\n|em/text2/', ,'<p><em>text1</em></p>\n<p><em>text2</em></p>']
]