const Chunk = require('../Chunk')
const { generateVariableName } = require('../utils')
const Node = require('./Node')

module.exports = class MemberExpression extends Node {
  meta = 'member-expression'

  transpile(chunk) {
    const object = this.traverse(this.node.object)
    const prop = this.traverse(this.node.property)

    if (this.node.optional && !this.features.includes('optionalChaining')) {
      if (this.node.object.type === 'Identifier' || this.node.object.type === 'ThisExpression') {
        return (
          chunk
            .add(`${this.node.object.name || 'this'} === null && ${this.node.object.name || 'this'} === void 0 ? void 0 : `)
            .add(`${this.node.object.name || 'this'}.`)
            .children(prop.all())
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
          .children(object.all())
          .add(') ')
          .add(`=== null && ${varName} === void 0 ? void 0 : `)
          .add(`${varName}.`)
          .children(prop.all())
      )
    }

    chunk.addIf(this.node.object.type === 'NewExpression', '(')
    chunk.children(object.all())
    chunk.addIf(this.node.object.type === 'NewExpression', ')')

    if (this.node.computed) {
      chunk
        .add('[')
        .children(prop.all())
        .add(']')
    } else {
      chunk
        .add('.')
        .children(prop.all())
    }

    return chunk
  }
}
