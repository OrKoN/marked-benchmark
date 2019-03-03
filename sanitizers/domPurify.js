'use strict';

const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const DOMPurify = createDOMPurify(new JSDOM('').window);

module.exports = function domPurify(md, markedOptions) {
  return DOMPurify.sanitize(
    marked(md, {
      ...markedOptions,
      sanitize: false,
    }),
  );
};
