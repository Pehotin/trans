const Node = require('./Node')

module.exports = class ObjectPattern extends Node {
  meta = 'object-pattern'

  transpile(chunk) {
    const properties = this.traverse(this.node.properties)

    if (this.features.includes('destructuring')) {
      chunk
        .add('{')

      properties.all().forEach((chunkChild, i, array) => {
        if (i === array.length - 1) {
          chunkChild.removeLast()
          chunk.space().children([chunkChild]).space()
        } else {
          chunk.space().children([chunkChild])
        }
      })

      chunk
        .add('}')

      return chunk
    }

    this.node.properties.forEach((prop, i) => {
      if (i !== 0) {
        chunk
          .add(',')
          .space()
      }

      if (prop.type === 'Property') {
        chunk
          .add(prop.key.name)
          .space()
          .add('=')
          .space()
          .add('--id--')
          .add('.')
          .add(prop.key.name)
      }

      if (prop.type === 'AssignmentPattern') {
        const val = this.traverse(prop.right)
        const name = this.traverse(prop.left)

        chunk
          .children(name.all())
          .space()
          .add('=')
          .space()
          .add('--id--')
          .add('.')
          .children(name.all())
          .add(' === void 0 ? ')
          .children(val.all())
          .add(' : ')
          .add('--id--')
          .add('.')
          .children(name.all())
      }
    })

    return chunk
  }
}
