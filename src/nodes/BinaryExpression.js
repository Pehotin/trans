const Node = require('./Node')

module.exports = class BinaryExpression extends Node {
  meta = 'binary-expression'

  transpile(chunk) {
    const leftCollection = this.traverse(this.node.left)
    const rightCollection = this.traverse(this.node.right)

    if (this.node.operator === '**' && !this.features.includes('exponentiation')) {
      return (
        chunk
          .add('Math.pow(')
          .children(leftCollection.all())
          .add(', ')
          .children(rightCollection.all())
          .add(')')
      )
    }

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
