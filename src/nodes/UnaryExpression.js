const Node = require('./Node')

module.exports = class UnaryExpression extends Node {
  meta = 'unary-expression'

  transpile(chunk) {
    const children = this.traverse(this.node.right)

    return (
      chunk
        .add(this.node.operator)
        .space()
        .children(children.all())
    )
  }
}
