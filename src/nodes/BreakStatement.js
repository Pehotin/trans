const Node = require('./Node')

module.exports = class BreakStatement extends Node {
  meta = 'break-statement'

  transpile(chunk) {
    return chunk.add('break').semicolon().line()
  }
}
