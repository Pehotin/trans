const Node = require('./Node')

module.exports = class ObjectPattern extends Node {
  meta = 'object-pattern'

  transpile(chunk) {
    return chunk
  }
}
