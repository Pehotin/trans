const Trans = require('../src')
const fs = require('node:fs')
const data = fs.readFileSync('./test.js', 'utf-8')

Trans.pile(data, {
  target: 'es3',
  output: './output.js',
  returnHelpers: true
})

console.log(Trans.getHelpers())

//const util = require('util')
// console.log(util.inspect(ast, false, null, true))
