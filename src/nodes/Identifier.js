const Node = require('./Node')

module.exports = class Identifier extends Node {
  meta = 'identifier'

  transpile(chunk) {
    return (
      chunk
        .add(this.node.name)
    )
  }
}
