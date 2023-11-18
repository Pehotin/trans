const Node = require('./Node')

module.exports = class ForStatement extends Node {
  meta = 'for-statement'

  init() {
    this.createScope()
  }

  transpile(chunk) {
    const body = this.traverse(this.node.body.body)
    const init = this.traverse(this.node.init)
    const condition = this.traverse(this.node.condition)
    const update = this.traverse(this.node.update)

    const initLastChunk = init.last()

    if (initLastChunk.getLast().strings) {
      chunk
        .add('for (')
        .children(init.all())
        .add('; ')
    } else if (initLastChunk.getLast() === '\n') {
      initLastChunk.removeLast()

      chunk
        .add('for (')
        .children(init.all())
        .space()
    }

    chunk
      .children(condition.all())
      .add('; ')
      .children(update.all())
      .add(') {')
      .line()
      .indentStart()
      .prepend()
      .children(body.all())
      .append()
      .indentEnd()
      .add('}')
      .line()

    return chunk
  }
}
