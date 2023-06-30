const Node = require('./Node')

module.exports = class MemberExpression extends Node {
  meta = 'member-expression'

  transpile(chunk) {
    return (
      chunk
        .addIf(this.node.object.type === 'ThisExpression', 'this')
        .addIf(this.node.object.type === 'Identifier', this.node.object.name)
        .add(`.${this.node.property.name}`)
    )
  }
}
