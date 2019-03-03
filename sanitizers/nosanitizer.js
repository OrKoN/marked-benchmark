'use strict';

const marked = require('marked');

module.exports = function builtin(md, markedOptions) {
  return marked(md, {
    ...markedOptions,
    sanitize: false,
  });
};
