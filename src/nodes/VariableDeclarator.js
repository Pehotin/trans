const Node = require('./Node')

module.exports = class VariableDeclarator extends Node {
  meta = 'variable-declarator'

  transpile(chunk) {
    const id = this.traverse(this.node.id)

    if (id.get('array-pattern').length && !this.features.includes('destructuring')) {
      const initializer = this.traverse(this.node.initializer)

      id.each((chunkChild, i) => {
        chunkChild.replaceAll('--id--', initializer.all())
      })

      chunk
        .children(id.all())

      return chunk
    }

    if (id.get('object-pattern').length && !this.features.includes('destructuring')) {
      const initializer = this.traverse(this.node.initializer)

      id.each((chunkChild, i) => {
        chunkChild.replaceAll('--id--', initializer.all())
      })

      chunk
        .children(id.all())

      return chunk
    }

    chunk
      .children(id.all())

    if (this.node.initializer) {
      const initializer = this.traverse(this.node.initializer)

      chunk
        .space()
        .add('=')
        .space()
        .children(initializer.all())
    }

    return chunk
  }
}
