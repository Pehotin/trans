const Node = require('./Node')

module.exports = class ImportDefaultSpecifier extends Node {
  meta = 'import-default-specifier'

  transpile(chunk) {
    const local = this.traverse(this.node.local)

    return chunk.children(local.all())
  }
}
