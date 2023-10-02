const Node = require('./Node')

module.exports = class ObjectPattern extends Node {
  meta = 'object-pattern'

  transpile(chunk) {
    console.log(this.node)
    return chunk
  }
}
