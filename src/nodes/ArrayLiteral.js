const Node = require('./Node')

module.exports = class ArrayLiteral extends Node {
  meta = 'array-literal'

  transpile(chunk) {
    chunk.add('[')

    this.node.elements.forEach((node, i) => {
      const chunkChild = this.traverse(node).first()

      if (i === 0) {
        chunk.children([chunkChild])
      } else {
        chunk.add(', ').children([chunkChild])
      }
    })

    chunk.add(']')

    return chunk
  }
}
