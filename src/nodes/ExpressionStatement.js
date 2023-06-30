const { traverse } = require('../utils')
const Node = require('./Node')

module.exports = class ExpressionStatement extends Node {
  node = null
  parent = null

  constructor(node, parent) {
    super()

    this.node = node
    this.parent = parent
  }

  transpile(chunk) {
    const children = traverse(this.node.expression, this)

    return chunk.children(children.all()).semicolon().line()
  }
}
