const Node = require('./Node')

module.exports = class DoWhileStatement extends Node {
  meta = 'do-while-statement'

  transpile(chunk) {
    const condition = this.traverse(this.node.condition)
    const body = this.traverse(this.node.body)

    const lastChunk = body.last()

    if (lastChunk.hasMeta('block')) {
      lastChunk.removeLast(2)
    } else if (lastChunk.hasMeta('expression-statement')) {
      lastChunk.removeLast()
    }

    return (
      chunk
        .add('do')
        .space()
        .children(body.all())
        .space()
        .add('while')
        .space()
        .add('(')
        .children(condition.all())
        .add(')')
    )
  }
}
