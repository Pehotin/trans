const Node = require('./Node')

module.exports = class ConditionalExpression extends Node {
  meta = 'conditional-expression'

  transpile(chunk) {
    const condition = this.traverse(this.node.condition)
    const consequent = this.traverse(this.node.consequent)
    const alternate = this.traverse(this.node.alternate)

    return (
      chunk
        .children(condition.all())
        .space()
        .add('?')
        .space()
        .children(consequent.all())
        .space()
        .add(':')
        .space()
        .children(alternate.all())
    )
  }
}
