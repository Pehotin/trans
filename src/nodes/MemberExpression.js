const { traverse } = require('../utils')
const Node = require('./Node')
const Chunk = require('../Chunk')

module.exports = class MemberExpression extends Node {
  node = null
  parent = null

  constructor(node, parent) {
    super()

    this.node = node
    this.parent = parent
  }

  transpile() {
    const chunk = new Chunk()

    return (
      chunk
        .addIf(this.node.object.type === 'ThisExpression', 'this')
        .addIf(this.node.object.type === 'Identifier', this.node.object.name)
        .add(`.${this.node.property.name}`)
    )
  }
}
