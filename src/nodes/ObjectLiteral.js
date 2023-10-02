const Chunk = require('../Chunk')
const { generateVariableName } = require('../utils')
const Node = require('./Node')

module.exports = class ObjectLiteral extends Node {
  meta = 'object-literal'

  transpile(chunk) {
    if (this.features.includes('conciseMethodProperty')) {
      return this._transpileSupported(chunk)
    }

    const properties = this.traverse(this.node.properties)

    if (properties.has('computed')) {
      const node = this.parent.nodeWithScope
      const scope = node.scope
      const varName = generateVariableName(scope)

      scope.addDeclaration(varName, null, 'var')
      node.prepend((new Chunk()).addMeta('variable').add(`var ${varName};`).line())

      chunk
        .add('(')
        .line()
        .indentStart()
        .add(varName)
        .space()
        .add('=')
        .space()
        .add('{}')
        .add(',')
        .line()

      properties.each((chunkChild) => {
        if (chunkChild.hasMeta('computed')) {
          chunkChild.addTo(0, varName)
        } else {
          chunkChild.addTo(0, varName + '.')
          chunkChild.replace(':', ' =')
        }

        chunk.children([chunkChild])
      })

      chunk
        .add(varName)
        .indentEnd()
        .line()
        .add(')')

      return chunk
    }

    properties.each((chunkChild) => {
      chunkChild.addTo(0, '\n')
    })

    return (
      chunk
        .add('{')
        .indentStart()
        .children(properties.all())
        .indentEnd()
        .add('}')
    )
  }

  _transpileSupported(chunk) {
    const properties = this.traverse(this.node.properties)

    return (
      chunk
        .add('{')
        .line()
        .indentStart()
        .children(properties.all())
        .indentEnd()
        .add('}')
    )
  }
}
