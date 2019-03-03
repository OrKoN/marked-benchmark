'use strict';

const marked = require('marked');
const insane = require('insane');

const insaneOptions = {
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title'],
    input: ['type', 'checked', 'disabled'],
    code: ['class'],
    span: ['class'],
    th: ['align'],
    tr: ['align'],
  },
  allowedClasses: {},
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedTags: [
    'a',
    'article',
    'b',
    'blockquote',
    'br',
    'caption',
    'code',
    'del',
    'details',
    'div',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'img',
    'input',
    'ins',
    'kbd',
    'label',
    'li',
    'main',
    'ol',
    'p',
    'pre',
    'section',
    'span',
    'strike',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ],
  filter: (node) => {
    [['code', 'language-'], ['span', 'hljs-']].forEach(([tag, prefix]) => {
      if (
        node.tag === tag &&
        typeof node.attrs.class === 'string' &&
        (/\s/.test(node.attrs.class) || !node.attrs.class.startsWith(prefix))
      ) {
        delete node.attrs.class;
      }
    });

    return true;
  },
  transformText: null,
};

for (let i = 1; i <= 6; i++) {
  insaneOptions.allowedAttributes[`h${i}`] = ['id'];
}

module.exports = function insance(md, markedOptions) {
  return insane(
    marked(md, {
      ...markedOptions,
      sanitize: false,
    }),
    insaneOptions,
  );
};
