const Node = require('./Node')

module.exports = class ThrowStatement extends Node {
  meta = 'throw-statement'

  transpile(chunk) {
    const argument = this.traverse(this.node.argument)
    return chunk.add('throw').space().children(argument.all()).semicolon()
  }
}
