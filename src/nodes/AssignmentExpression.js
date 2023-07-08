const Node = require('./Node')
const { createVar } = require('../utils')

module.exports = class AssigmentExpression extends Node {
  meta = 'assigment-expression'

  transpile(chunk) {
    const variable = this.traverse(this.node.left)
    const expression = this.traverse(this.node.right)

    if (!this.features.includes('logicalAssignmentOperators')) {
      if (this.node.operator === '&&=' || this.node.operator === '||=') {
        if (this.node.left.type === 'Identifier' || this.node.left.type === 'ThisExpression') {
          return (
            chunk
              .children(variable.all())
              .space()
              .add(this.node.operator === '&&=' ? '&&' : '||')
              .space()
              .add('(')
              .children(variable.all())
              .space()
              .add('=')
              .space()
              .children(expression.all())
              .add(')')
          )
        }

        const varName = createVar(this)

        return (
          chunk
            .add(`(${varName} = `)
            .children(variable.all())
            .add(') ')
            .add(this.node.operator === '&&=' ? '&&' : '||')
            .space()
            .add('(')
            .add(varName)
            .space()
            .add('=')
            .space()
            .children(expression.all())
            .add(')')
        )
      }

      if (this.node.operator === '??=') {
        if (this.node.left.type === 'Identifier' || this.node.left.type === 'ThisExpression') {
          return (
            chunk
              .children(variable.all())
              .space()
              .add('!== null && ')
              .children(variable.all())
              .add(' !== void 0 ? ')
              .children(variable.all())
              .add(' : (')
              .children(variable.all())
              .add(' = ')
              .children(expression.all())
              .add(')')
          )
        }

        const varName = createVar(this)

        return (
          chunk
            .add(`(${varName} = `)
            .children(variable.all())
            .add(') ')
            .add(`!== null && ${varName} !== void 0 ? ${varName} : ${varName} = `)
            .children(expression.all())
        )
      }
    }

    return (
      chunk
        .children(variable.all())
        .space()
        .add(this.node.operator)
        .space()
        .children(expression.all())
    )
  }
}
