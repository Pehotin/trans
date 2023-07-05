const Chunk = require('../Chunk')
const { generateVariableName } = require('../utils')
const Node = require('./Node')

module.exports = class LogicalExpression extends Node {
  meta = 'logical-expression'

  transpile(chunk) {
    const leftCollection = this.traverse(this.node.left)
    const rightCollection = this.traverse(this.node.right)

    if (this.node.operator === '??' && !this.features.includes('nullishCoalescing')) {
      if (this.node.left.type === 'Identifier' || this.node.left.type === 'ThisExpression') {
        return (
          chunk
            .add(`${this.node.left.name || 'this'} !== null && ${this.node.left.name || 'this'} !== void 0 ? ${this.node.left.name || 'this'} : `)
            .children(rightCollection.all())
        )
      }

      const node = this.parent.nodeWithScope
      const scope = node.scope
      const varName = generateVariableName(scope)

      scope.addDeclaration(varName, null, 'var')
      node.prepend((new Chunk()).addMeta('variable').add(`var ${varName};`).line())

      return (
        chunk
          .add(`(${varName} = `)
          .children(leftCollection.all())
          .add(') ')
          .add(`!== null && ${varName} !== void 0 ? ${varName} : `)
          .children(rightCollection.all())
      )
    }

    return (
      chunk
        .children(leftCollection.all())
        .space()
        .add(this.node.operator)
        .space()
        .children(rightCollection.all())
    )
  }
}
