const Node = require('./Node')

module.exports = class ForStatement extends Node {
  meta = 'for-statement'

  init() {
    this.createScope()
  }

  transpile(chunk) {
    return chunk
  }
}
