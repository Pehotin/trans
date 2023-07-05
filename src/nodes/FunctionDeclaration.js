const { transpileParams } = require('../utils')
const Node = require('./Node')

module.exports = class FunctionDeclaration extends Node {
  meta = 'function'

  init() {
    this.createScope()
  }

  transpile(chunk) {
    const children = this.traverse(this.node.body.body)
    const extras = []

    chunk
      .addIf(this.node.isAsync, 'async ')
      .add('function')
      .space()
      .addIf(this.node.isGenerator, '* ')
      .add(this.node.id)
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
      .children(children.all())
      .append()
      .indentEnd()
      .add('}')
      .line(2)

    return chunk
  }
}
