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

const input = `
  # some markdown

  with some code

  \`\`\`html
    </code>
    </pre>
    <script>
     alert('hello world');
    </script>
  \`\`\`
`;

console.log('input markdow = ');
console.log(input);
console.log('');
console.log('sanitized with built-in marked sanitizer');
console.log(markedWithBuiltinSanitizer()(input));
console.log('');
console.log('sanitized with dompurify');
console.log(markedWithDOMPurify()(input));
console.log('');
console.log('no sanitizer');
console.log(markedNoSanitizer()(input));
console.log('');

suite
  .add('builtInSanitizer', function() {
    markedWithBuiltinSanitizer()(input);
  })
  .add('domPurifySanitizer', function() {
    markedWithDOMPurify()(input);
  })
  .add('noSanitizer', function() {
    markedNoSanitizer()(input);
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('complete', function() {
    benchmarks.log();
  })
  .run({ async: false });
