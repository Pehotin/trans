const Node = require('./Node')

module.exports = class EmptyStatement extends Node {
  meta = 'empty-statement'

  transpile(chunk) {
    return chunk.add(';').line()
  }
}
