const Node = require('./Node')

module.exports = class GroupExpression extends Node {
  meta = 'group-expression'

  transpile(chunk) {
    const expr = this.traverse(this.node.expression)

    return (
      chunk
        .add('(')
        .children(expr.all())
        .add(')')
    )
  }
}
