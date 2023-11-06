const Node = require('./Node')

module.exports = class ExportNamedDeclaration extends Node {
  meta = 'export-named-declaration'

  transpile(chunk) {
    const declaration = this.traverse(this.node.declaration).first()

    if (declaration.hasMeta('class')) {
      return (
        chunk
          .children([declaration])
          .add(`module.exports.${this.node.declaration.id.name} = ${this.node.declaration.id.name}`)
          .semicolon()
          .line(2)
      )
    } else if (declaration.hasMeta('function')) {
      return (
        chunk
          .add(`module.exports.${this.node.declaration.id} = `)
          .children([declaration])
          .semicolon()
          .line(2)
      )
    } else if (declaration.hasMeta('variable-declaration')) {
      this.node.declaration.declarations.forEach(dec => {
        chunk
          .add(`module.exports.${dec.id.name} = `)
          .children(this.traverse(dec.initializer).all())
          .semicolon()
          .line(2)
      })
      return chunk
    }

    throw new Error('ExportNamedDeclaration: Node type not implemented ' + this.node.type)
  }
}
