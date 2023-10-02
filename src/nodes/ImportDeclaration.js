const Node = require('./Node')

module.exports = class ImportDeclaration extends Node {
  meta = 'import-declaration'

  transpile(chunk) {
    const specifiers = this.traverse(this.node.specifiers)
    const source = this.traverse(this.node.source)

    chunk
      .add('var')
      .space()

    if (specifiers.has('import-specifier')) {
      chunk
        .add('{')
        .space()
    }

    specifiers.each((chunkChild, i) => {
      if (i !== 0) {
        chunk.add(',').space()
      }
      chunk.children([chunkChild])
    })

    if (specifiers.has('import-specifier')) {
      chunk
        .space()
        .add('}')
    }

    chunk
      .space()
      .add('=')
      .space()
      .add('require(')
      .children(source.all())
      .add(')')
      .semicolon()

    return chunk
  }
}
