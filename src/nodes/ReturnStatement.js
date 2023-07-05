const Node = require('./Node')

module.exports = class ReturnStatement extends Node {
  meta = 'return-statement'

  transpile(chunk) {
    let argument

    if (this.node.argument) {
      argument = this.traverse(this.node.argument)
    }

    chunk
      .add('return')

    if (argument) {
      chunk.space().children(argument.all()).semicolon().line()
    } else {
      chunk.semicolon().line()
    }

    return chunk
  }
}
