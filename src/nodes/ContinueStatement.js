const Node = require('./Node')

module.exports = class ContinueStatement extends Node {
  meta = 'continue-statement'

  transpile(chunk) {
    return chunk.add('continue').semicolon().line()
  }
}
