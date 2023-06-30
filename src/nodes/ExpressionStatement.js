const { traverse } = require('../utils')
const Node = require('./Node')

module.exports = class ExpressionStatement extends Node {
  meta = 'expression-statement'

  transpile(chunk) {
    const children = traverse(this.node.expression, this)

    return chunk.children(children.all()).semicolon().line()
  }
}
