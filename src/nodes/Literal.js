const Node = require('./Node')

module.exports = class Literal extends Node {
  meta = 'literal'

  transpile(chunk) {
    return (
      chunk
        .add(this.node.raw || this.node.value)
    )
  }
}
