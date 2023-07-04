const Chunk = require('../Chunk')
const { generateVariableName } = require('../utils')
const Node = require('./Node')

module.exports = class MemberExpression extends Node {
  meta = 'member-expression'

  transpile(chunk) {
    const object = this.traverse(this.node.object)
    const prop = this.traverse(this.node.property)

    if (this.node.optional && !this.features.includes('optionalChaining')) {
      if (this.node.object.type === 'Identifier') {
        return (
          chunk
            .add(`${this.node.object.name} === null && ${this.node.object.name} === void 0 ? void 0 : `)
            .add(`${this.node.object.name}.`)
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

    chunk.children(object.all())

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
