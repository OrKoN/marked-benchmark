'use strict';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const benchmarks = require('beautify-benchmark');
const fs = require('fs');

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
  mangle: false,
  pedantic: false,
  smartLists: false,
  smartypants: false,
  tables: false,
  renderer,
};

const input = fs.readFileSync('./samples/README.md', 'utf8');

const builtin = require('./sanitizers/builtin');
const domPurify = require('./sanitizers/domPurify');
const insane = require('./sanitizers/insane');
const nosanitizer = require('./sanitizers/nosanitizer');

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
