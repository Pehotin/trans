const Trans = require('../src')
const fs = require('node:fs')
const data = fs.readFileSync('./playground/test.js', 'utf-8')

Trans.pile(data, {
  target: 'es3',
  output: './playground/output.js',
  returnHelpers: true
})
