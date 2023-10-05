const Node = require('./Node')

module.exports = class ImportDeclaration extends Node {
  meta = 'import-declaration'

  transpile(chunk) {
    const source = this.traverse(this.node.source)

    this.node.specifiers.forEach((chunkChild, i) => {
      if (chunkChild.type === 'ImportDefaultSpecifier') {
        chunk
          .add('var')
          .space()
          .children(this.traverse(chunkChild.local).all())
          .space()
          .add('=')
          .space()
          .add('require(')
          .children(source.all())
          .add(')')
          .semicolon()
          .line(1)
      } else {
        chunk
          .add('var')
          .space()
          .children(this.traverse(chunkChild.local).all())
          .space()
          .add('=')
          .space()
          .add('require(')
          .children(source.all())
          .add(')')
          .add('.')
          .children(this.traverse(chunkChild.imported).all())
          .semicolon()
          .line(1)
      }
    })

    return chunk
  }
}
