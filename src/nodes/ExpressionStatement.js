const { traverse } = require('../utils')
const Node = require('./Node')
const Chunk = require('../Chunk')

module.exports = class ExpressionStatement extends Node {
  node = null
  parent = null

  constructor(node, parent) {
    super()

    this.node = node
    this.parent = parent
  }

  transpile() {
    const chunk = new Chunk()
    const children = traverse(this.node.expression, this)

    return chunk.children(children.all()).semicolon().line()
  }
}
