# marked-benchmark

Tests marked with different sanitizers.

## Results

without syntax highlighting:

```
  builtInSanitizer   x 1,312 ops/sec ±0.57% (95 runs sampled)
  domPurifySanitizer x 67.33 ops/sec ±12.68% (65 runs sampled)
  insaneSanitizer    x   640 ops/sec ±0.45% (90 runs sampled)
  noSanitizer        x 1,369 ops/sec ±0.38% (94 runs sampled)
```

with syntax highlighting:

```
  builtInSanitizer   x 35.11 ops/sec ±0.87% (61 runs sampled)
  domPurifySanitizer x 20.86 ops/sec ±5.94% (40 runs sampled)
  insaneSanitizer    x 29.11 ops/sec ±7.02% (52 runs sampled)
  noSanitizer        x 29.40 ops/sec ±6.24% (53 runs sampled)
```
