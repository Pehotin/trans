const Node = require('./Node')

module.exports = class ForOfStatement extends Node {
  meta = 'for-of-statement'

  init() {
    this.createScope()
  }

  transpile(chunk) {
    return this._transpileSupported(chunk)

    // TODO _transpileUnsupported
  }

  _transpileSupported(chunk) {
    console.log(this.node)
    const left = this.traverse(this.node.left)
    const right = this.traverse(this.node.right)
    const body = this.traverse(this.node.body)

    left.last().removeLast(2)

    return (
      chunk
        .add('for (')
        .children(left.all())
        .add(' of ')
        .children(right.all())
        .add(')')
        .space()
        .children(body.all())
    )
  }
}
