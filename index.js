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

  renderer.code = (code, language) => {
    const highlighted = hl.highlightAuto(code).value;
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
  };

  return renderer;
}

const DOMPurify = createDOMPurify(new JSDOM('').window);

function markedDOMPurify(md, opt) {
  return DOMPurify.sanitize(marked(md, opt));
}

const renderer = getRenderer();

const input = `
  # some markdown

  with some code

  <script>
    alert('hello world');
  </script>

  \`\`\`html
    </code>
    </pre>
    <script>
     alert('hello world');
    </script>
  \`\`\`
`;

const builtInSanitizerOpts = {
  renderer: getRenderer(),
  ...markedOptions,
  sanitize: true,
};

const domPurifySanitizerOpts = {
  renderer: getRenderer(),
  ...markedOptions,
  sanitize: false,
};

const noSanitizerOpts = {
  renderer: getRenderer(),
  ...markedOptions,
  sanitize: false,
};

console.log('input markdow = ');
console.log(input);
console.log('');
console.log('sanitized with built-in marked sanitizer');
console.log(marked(input, builtInSanitizerOpts));
console.log('');
console.log('sanitized with dompurify');
console.log(markedDOMPurify(input, domPurifySanitizerOpts));
console.log('');
console.log('no sanitizer');
console.log(marked(input, noSanitizerOpts));
console.log('');

suite
  .add('builtInSanitizer', function() {
    marked(input, builtInSanitizerOpts);
  })
  .add('domPurifySanitizer', function() {
    markedDOMPurify(input, domPurifySanitizerOpts);
  })
  .add('noSanitizer', function() {
    marked(input, noSanitizerOpts);
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('complete', function() {
    benchmarks.log();
  })
  .run({ async: false });
