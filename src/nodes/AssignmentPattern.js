const Node = require('./Node')

module.exports = class AssignmentPattern extends Node {
  meta = 'assignment-pattern'

  transpile(chunk) {
    const left = this.traverse(this.node.left)
    const right = this.traverse(this.node.right)

    return (
      chunk
        .children(left.all())
        .add(' = ')
        .children(right.all())
    )
  }
}
