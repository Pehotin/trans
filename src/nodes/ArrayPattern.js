const Node = require('./Node')

module.exports = class ArrayPattern extends Node {
  meta = 'array-pattern'

  transpile(chunk) {
    const elements = this.traverse(this.node.elements)

    if (this.features.includes('destructuring')) {
      chunk
        .add('[')

      elements.each((chunkChild, i) => {
        if (i === 0) {
          chunk.children([chunkChild])
        } else {
          chunk.add(',').space().children([chunkChild])
        }
      })

      chunk
        .add(']')

      return chunk
    }

    elements.each((chunkChild, i) => {
      if (i !== 0) {
        chunk
          .add(',')
          .space()
      }

      if (chunkChild.hasMeta('identifier')) {
        chunk
          .children([chunkChild])
          .space()
          .add('=')
          .space()
          .add('--id--')
          .add('[')
          .add(i)
          .add(']')
      } else if (chunkChild.hasMeta('rest-element')) {
        chunkChild.replace('...', '')

        chunk
          .children([chunkChild])
          .space()
          .add('=')
          .space()
          .add('--id--')
          .add('.')
          .add('slice(')
          .add(i)
          .add(')')
      }
    })

    return chunk
  }
}
