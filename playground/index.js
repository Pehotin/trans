const Trans = require('../src')
const fs = require('node:fs')
const util = require('util')

const data = fs.readFileSync('./test.js', 'utf-8')

Trans.pile(data, {
  target: 'es6',
  output: './output.js'
})

// console.log(util.inspect(ast, false, null, true))
