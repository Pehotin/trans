const Node = require('./Node')

module.exports = class LogicalExpression extends Node {
  meta = 'logical-expression'

  transpile(chunk) {
    const leftCollection = this.traverse(this.node.left)
    const rightCollection = this.traverse(this.node.right)

    return (
      chunk
        .children(leftCollection.all())
        .space()
        .add(this.node.operator)
        .space()
        .children(rightCollection.all())
    )
  }
}
