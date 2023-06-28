const { traverse } = require('../utils')
const Node = require('./Node')
const Chunk = require('../Chunk')

module.exports = class AssigmentExpression extends Node {
  node = null
  parent = null
  depth = 0

  constructor(node, parent) {
    super()

    this.node = node
    this.parent = parent
    this.depth = parent.depth + 1
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
    }

    return chunk
  }
}
