const Node = require('./Node')

module.exports = class UpdateExpression extends Node {
  meta = 'update-expression'

  transpile(chunk) {
    const children = this.traverse(this.node.argument)

    return (
      chunk
        .children(children.all())
        .add(this.node.operator)
    )
  }
}
