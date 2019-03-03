'use strict';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const benchmarks = require('beautify-benchmark');

const marked = require('marked');
const hl = require('highlight.js');
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
const markedOptions = {
  breaks: true,
  gfm: true,
  mangle: true,
  pedantic: false,
  smartLists: true,
  smartypants: true,
  tables: false,
  renderer,
};

const input = `
  # some markdown

  with some code

  <img src="sdfg" onerror="alert(1)" />

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

const builtin = require('./sanitizers/builtin');
const domPurify = require('./sanitizers/domPurify');
const insane = require('./sanitizers/insane');
const nosanitizer = require('./sanitizers/nosanitizer');

console.log('input markdow = ');
console.log(input);
console.log('');
console.log('');
console.log('sanitized with built-in marked sanitizer');
console.log(builtin(input, markedOptions));
console.log('');
console.log('');
console.log('sanitized with dompurify');
console.log(domPurify(input, markedOptions));
console.log('');
console.log('');
console.log('insane');
console.log(insane(input, markedOptions));
console.log('');
console.log('');
console.log('no sanitizer');
console.log(nosanitizer(input, markedOptions));
console.log('');

suite
  .add('builtInSanitizer', function() {
    builtin(input, markedOptions);
  })
  .add('domPurifySanitizer', function() {
    domPurify(input, markedOptions);
  })
  .add('insaneSanitizer', function() {
    insane(input, markedOptions);
  })
  .add('noSanitizer', function() {
    nosanitizer(input, markedOptions);
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('complete', function() {
    benchmarks.log();
  })
  .run({ async: false });
