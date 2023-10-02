const Node = require('./Node')

module.exports = class ImportSpecifier extends Node {
  meta = 'import-specifier'

  transpile(chunk) {
    const local = this.traverse(this.node.local)
    const imported = this.traverse(this.node.imported)

    if (this.node.imported.name !== this.node.local.name) {
      return chunk.children(imported.all()).add(':').space().children(local.all())
    }

    return chunk.children(local.all())
  }
}
