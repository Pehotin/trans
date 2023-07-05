const Node = require('./Node')

module.exports = class WhileStatement extends Node {
  meta = 'while-statement'

  transpile(chunk) {
    const condition = this.traverse(this.node.condition)
    const body = this.traverse(this.node.body)

    return (
      chunk
        .add('while (')
        .children(condition.all())
        .add(')')
        .space()
        .children(body.all())
    )
  }
}
