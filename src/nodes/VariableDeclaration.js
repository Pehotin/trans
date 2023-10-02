const Node = require('./Node')

module.exports = class VariableDeclaration extends Node {
  meta = 'variable-declaration'

  transpile(chunk) {
    const declarations = this.traverse(this.node.declarations)

    if (this.features.includes('letConst')) {
      chunk
        .add(this.node.kind.toLowerCase())
        .space()
    } else {
      chunk
        .add('var')
        .space()
    }

    declarations.each((chunkChild, i) => {
      if (i === 0) {
        chunk.children([chunkChild])
      } else {
        chunk.add(',').space().children([chunkChild])
      }
    })

    return chunk.semicolon().line()
  }
}
