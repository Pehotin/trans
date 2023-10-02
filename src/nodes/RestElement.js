const Node = require('./Node')

module.exports = class RestElement extends Node {
  meta = 'rest-element'

  transpile(chunk) {
    const argument = this.traverse(this.node.argument)
    chunk.add('...')

    if (Array.isArray(this.node.argument)) {
      chunk.add('[')

      argument.each((chunkChild, i) => {
        if (i === 0) {
          chunk.children([chunkChild])
        } else {
          chunk.add(',').space().children([chunkChild])
        }
      })

      chunk.add(']')
    } else {
      chunk.children(argument.all())
    }

    return chunk
  }
}
