const Node = require('./Node')

module.exports = class RegularExpressionLiteral extends Node {
  meta = 'regular-expression-literal'

  transpile(chunk) {
    return (
      chunk
        .add(this.node.expression)
        .add(this.node.flags)
    )
  }
}
