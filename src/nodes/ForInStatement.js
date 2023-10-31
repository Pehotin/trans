const Node = require('./Node')

module.exports = class ForInStatement extends Node {
  meta = 'for-in-statement'

  init() {
    this.createScope()
  }

  transpile(chunk) {
    const left = this.traverse(this.node.left)
    const right = this.traverse(this.node.right)
    const body = this.traverse(this.node.body)

    left.last().removeLast(2)

    return (
      chunk
        .add('for (')
        .children(left.all())
        .add(' in ')
        .children(right.all())
        .add(')')
        .space()
        .children(body.all())
    )
  }
}
