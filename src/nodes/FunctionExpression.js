const { transpileParams } = require('../utils')
const Node = require('./Node')

module.exports = class FunctionExpression extends Node {
  meta = 'function-expression'

  init() {
    this.createScope()
  }

  transpile(chunk) {
    const body = this.traverse(this.node.body.body)
    const extras = []

    chunk
      .add('function')
      .space()

    if (this.node.id) {
      const id = this.traverse(this.node.id)

      chunk
        .children(id.all())
    }

    chunk
      .add('(')

    transpileParams(this.node.params, chunk, this, extras)

    chunk
      .add(')')
      .space()
      .add('{')
      .line()
      .indentStart()
      .prepend()

    if (extras.length > 0) {
      chunk.children(extras)
    }

    chunk
      .children(body.all())
      .append()
      .indentEnd()
      .add('}')

    return chunk
  }
}
