const Node = require('./Node')
const Chunk = require('../Chunk')

module.exports = class ThisExpression extends Node {
  meta = 'this-expression'

  transpile(chunk) {
    const node = this.getFirstParentNode('ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration', 'MethodDefinition')

    if (node.meta === 'arrow-function-expression') {
      const node = this.getFirstParentNode('MethodDefinition', 'Program')
      const scope = node.scope

      try {
        if (scope.addDeclaration('_self', null, 'var')) {
          node.prepend((new Chunk()).addMeta('variable').add(`var _self = this;`).line())
        }
      } catch {}

      return chunk.add('_self')
    }

    return chunk.add('this')
  }
}
