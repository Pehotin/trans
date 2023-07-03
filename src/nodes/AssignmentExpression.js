const Node = require('./Node')

module.exports = class AssigmentExpression extends Node {
  meta = 'assigment'

  transpile(chunk) {
    const children = this.traverse(this.node.left)

    chunk
      .children(children.all())
      .space()
      .add(this.node.operator)
      .space()

    if (this.node.right.type === 'Identifier') {
      chunk.add(this.node.right.name)
    } else if (this.node.right.type === 'Literal') {
      chunk.add(this.node.right.raw || this.node.right.value)
    }

    return chunk
  }
}
