const Node = require('./Node')

module.exports = class CallExpression extends Node {
  meta = 'call-expression'

  transpile(chunk) {
    const callee = this.traverse(this.node.callee)
    const args = this.traverse(this.node.args)

    chunk
      .children(callee.all())
      .add('(')

    args.all().forEach((arg, i) => {
      if (i === 0) {
        chunk
          .children([arg])
      } else {
        chunk
          .add(',')
          .space()
          .children([arg])
      }
    })

    return chunk.add(')')
  }
}
