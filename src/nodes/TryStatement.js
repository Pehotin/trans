const Node = require('./Node')

module.exports = class TryStatement extends Node {
  meta = 'try-statement'

  transpile(chunk) {
    const tryBlock = this.traverse(this.node.block)
    const catchBlock = this.traverse(this.node.handler.body)

    chunk
      .add('try')
      .space()
      .children(tryBlock.all())

    tryBlock.last().removeLast(2)

    chunk
      .add(' catch ')

    if (!this.node.handler.param) {
      if (!this.features.includes('optionalCatchParam')) {
        chunk
          .add('(_e)')
          .space()
      }
    } else {
      const param = this.traverse(this.node.handler.param)
      chunk
        .add('(')
        .children(param.all())
        .add(')')
        .space()
    }

    chunk.children(catchBlock.all())

    if (this.node.finalizer) {
      const finalBlock = this.traverse(this.node.finalizer)
      catchBlock.last().removeLast(2)

      chunk
        .space()
        .add('finally')
        .space()
        .children(finalBlock.all())
    }

    return chunk
  }
}
