'use strict';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const benchmarks = require('beautify-benchmark');
const marked = require('marked');
const hl = require('highlight.js');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const markedOptions = {
  breaks: true,
  gfm: true,
  mangle: true,
  pedantic: false,
  smartLists: true,
  smartypants: true,
  tables: false,
};

function getRenderer() {
  const renderer = new marked.Renderer();

  renderer.heading = function(text) {
    return '<p><strong>' + text + '</strong></p>';
  };

  renderer.hr = function() {
    return '\n';
  };

  renderer.image = renderer.link;

  renderer.code = (code, language, escaped) => {
    const highlighted = hl.highlightAuto(code).value;
    return `<pre><code class="hljs ${language}">${
      highlighted === code ? escaped : highlighted
    }</code></pre>`;
  };

  return renderer;
}

function markedWithBuiltinSanitizer() {
  marked.setOptions({
    renderer: getRenderer(),
    ...markedOptions,
    sanitize: true,
  });
  return marked;
}

function markedNoSanitizer() {
  marked.setOptions({
    renderer: getRenderer(),
    ...markedOptions,
    sanitize: false,
  });
  return marked;
}

function markedWithDOMPurify() {
  const DOMPurify = createDOMPurify(new JSDOM('').window);

  marked.setOptions({
    renderer: getRenderer(),
    ...markedOptions,
    sanitize: false,
  });

  return function(md) {
    const dirty = marked(md);
    return DOMPurify.sanitize(dirty);
  };
}

const builtInSanitizer = markedWithBuiltinSanitizer();
const domPurifySanitizer = markedWithDOMPurify();
const noSanitizer = markedNoSanitizer();

const input = `
  # some markdown

  with some code

  \`\`\`js
     alert('hello world');
  \`\`\`
`;

console.log('input markdow = ');
console.log(input);
console.log('');
console.log('sanitized with built-in marked sanitizer');
console.log(builtInSanitizer(input));
console.log('');
console.log('sanitized with dompurify');
console.log(domPurifySanitizer(input));
console.log('');
console.log('no sanitizer');
console.log(noSanitizer(input));
console.log('');

suite
  .add('builtInSanitizer', function() {
    builtInSanitizer(input);
  })
  .add('domPurifySanitizer', function() {
    domPurifySanitizer(input);
  })
  .add('noSanitizer', function() {
    noSanitizer(input);
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('complete', function() {
    benchmarks.log();
  })
  .run({ async: true });
