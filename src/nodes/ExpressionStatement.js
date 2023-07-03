const Node = require('./Node')

module.exports = class ExpressionStatement extends Node {
  meta = 'expression-statement'

  transpile(chunk) {
    const children = this.traverse(this.node.expression)

    return chunk.children(children.all()).semicolon().line()
  }
}
