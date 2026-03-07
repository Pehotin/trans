## @pehotin/trans

**Trans** is a small JavaScript transpiler that takes modern JavaScript and downlevels it to older ECMAScript targets (like ES3/ES5) using an AST produced by Parker (@pehotin/parker). Created for a learning purpose mainly.

It is designed to be used programmatically from Node.js and to be embedded into build tooling.

### Installation

```bash
npm install @pehotin/trans
```

### Quick start

Transpile a string of JavaScript and get the result back as a string:

```js
const Trans = require('@pehotin/trans')

const source = `
const add = (a, b) => a + b
`

const output = Trans.pile(source, {
  target: 'es3',
  returnHelpers: true,
})

console.log(output)
console.log(Trans.getHelpers()) // helper chunks that were injected
```

Transpile a file and write the result to disk (similar to the included playground):

```js
const Trans = require('@pehotin/trans')
const fs = require('node:fs')

const source = fs.readFileSync('./input.js', 'utf-8')

Trans.pile(source, {
  target: 'es3',
  output: './output.js',
  returnHelpers: true,
})
```

### Playground

This repo contains a small playground that transpiles `playground/test.js` into `playground/output.js`.

```bash
npm install
npm run play
```

You can edit `playground/test.js` and re‑run the script to experiment with how different constructs are transformed.

### API

- **`Trans.pile(source, options)`**
  - **`source`**:
    - A JavaScript source string, or
    - An existing AST node with `type === 'Program'`.
  - **`options`**: configuration object (see **Options** below).
  - **Returns**: transpiled JavaScript as a string.
  - **Side‑effects**: if `options.output` is set, the transpiled code is also written to that path.

- **`Trans.getHelpers()`**
  - Returns an array of helper chunks that were generated during the last `pile` call (only populated when `returnHelpers: true` is set in options).

### Options

All options are optional; if omitted, defaults are used.

- **`target`**: ECMAScript target version.
  - **Type**: string
  - **Default**: `'es3'`
  - **Allowed values**: `'es3'`, `'es5'`, `'es6'`, `'es2016'`, `'es2017'`, `'es2018'`, `'es2019'`, `'es2020'`, `'es2021'`, `'es2022'`

- **`output`**: path to a file where the transpiled code should be written.
  - **Type**: string
  - **Default**: empty string (`''`, meaning “do not write to disk”)

- **`indentSpaces`**: number of spaces to use for indentation in generated code.
  - **Type**: number
  - **Default**: `2`

- **`returnHelpers`**: whether to collect and expose helper chunks via `Trans.getHelpers()`.
  - **Type**: boolean
  - **Default**: `false`

### Error handling

- If `source` is not provided, `Trans.pile` throws an error.
- If `source` is neither a string nor a `Program` AST node, `Trans.pile` throws an error.
- Invalid option values (for example, an unsupported `target` or a non‑string `output`) are reported to the console.

### License

MIT © Artem P

