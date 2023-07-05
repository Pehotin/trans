const Node = require('./Node')

module.exports = class IfStatement extends Node {
  meta = 'if-statement'

  transpile(chunk) {
    const condition = this.traverse(this.node.condition)
    const ifBranch = this.traverse(this.node.ifBranch)
    const elseBranch = this.node.elseBranch ? this.traverse(this.node.elseBranch) : null

    chunk
      .add('if (')
      .children(condition.all())
      .add(')')
      .space()

    if (elseBranch) {
      const ifChunk = ifBranch.last().removeLast(2)

      chunk
        .children([ifChunk])
        .space()
        .add('else')
        .space()
        .children(elseBranch.all())
    } else {
      chunk.children(ifBranch.all())
    }

    return chunk
  }
}
