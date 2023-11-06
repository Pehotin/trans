const Node = require('./Node')

module.exports = class ExportDefaultDeclaration extends Node {
  meta = 'export-default-declaration'

  transpile(chunk) {
    const declaration = this.traverse(this.node.declaration).first()

    if (declaration.hasMeta('class')) {
      return (
        chunk
          .children([declaration])
          .add(`module.exports = ${this.node.declaration.id.name};`).line(2)
      )
    }

    return (
      chunk
        .add('module.exports = ')
        .children([declaration])
        .add(';')
        .line(2)
    )
  }
}
