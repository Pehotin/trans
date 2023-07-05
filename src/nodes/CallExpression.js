const Node = require('./Node')

module.exports = class CallExpression extends Node {
  meta = 'call-expression'

  transpile(chunk) {
    const callee = this.traverse(this.node.callee)

    return (
      chunk
        .children(callee.all())
        .add('()')
    )
  }
}
