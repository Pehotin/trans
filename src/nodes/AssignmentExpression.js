const { traverse } = require('../utils')
const Node = require('./Node')
const Chunk = require('../Chunk')

module.exports = class AssigmentExpression extends Node {
  node = null
  parent = null

  constructor(node, parent) {
    super()

    this.node = node
    this.parent = parent
  }

  transpile() {
    const chunk = new Chunk()
    const children = traverse(this.node.left, this)

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
