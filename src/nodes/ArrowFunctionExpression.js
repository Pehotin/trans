const { transpileParams } = require('../utils')
const Node = require('./Node')

module.exports = class ArrowFunctionExpression extends Node {
  meta = 'arrow-function-expression'

  init() {
    this.createScope()
  }

  transpile(chunk) {
    if (this.features.includes('arrow')) {
      const body = this.traverse(this.node.body.body)

      chunk
        .add('(')

      transpileParams(this.node.params, chunk, this)

      chunk
        .add(') => {')
        .line()
        .indentStart()
        .prepend()
        .children(body.all())
        .append()
        .indentEnd()
        .add('}')

      return chunk
    }

    return this._transpileUnsupported(chunk)
  }

  _transpileUnsupported(chunk) {
    const body = this.traverse(this.node.body.body)
    const extras = []

    chunk
      .add('function')
      .space()
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
