const Chunk = require('./Chunk')

const transpileParams = function(nodes, chunk, node, extra) {
  if (node.features.includes('defaultParameter')) {
    nodes.forEach((param, i) => {
      if (i !== 0) {
        chunk.add(', ')
      }

      if (param.type === 'Identifier') {
        chunk.add(`${param.name}`)
      } else if (param.type === 'AssignmentExpression' || param.type === 'AssignmentPattern') {
        chunk
          .add(`${param.left.name}`)
          .space()
          .add('=')
          .space()
          .children(node.traverse(param.right).all())
      } else if (param.type === 'SpreadElement' || param.type === 'RestElement') {
        chunk
          .add('...')
          .add(param.argument.name)
      }
    })
  } else {
    nodes.forEach((param, i) => {
      if (i !== 0) {
        chunk.add(', ')
      }

      if (param.type === 'Identifier') {
        chunk.add(`${param.name}`)
      } else if (param.type === 'AssignmentExpression' || param.type === 'AssignmentPattern') {
        chunk.add(`${param.left.name}`)

        const defaultChunk = new Chunk()
        defaultChunk
          .add(`if (${param.left.name} === void 0) { ${param.left.name} = `)
          .children(node.traverse(param.right).all())
          .semicolon()
          .space()
          .add('}')
          .line()

        extra.push(defaultChunk)
      } else if (param.type === 'SpreadElement' || param.type === 'RestElement') {
        if (i !== 0) {
          chunk.removeLast()
        }

        const defaultChunk = new Chunk()
        defaultChunk
          .add(`var ${param.argument.name} = [];`)
          .line()
          .add(`for (var _i = 1; _i < arguments.length; _i++) {`)
          .line()
          .indentStart()
          .add(`${param.argument.name}[_i - 1] = arguments[_i];`)
          .indentEnd()
          .line()
          .add('}')
          .line()

        extra.push(defaultChunk)
      }
    })
  }

  return chunk
}

const generateVariableName = function(scope) {
  let charCode = 97

  while (scope.contains('_' + String.fromCharCode(charCode))){
    charCode++
  }

  return '_' + String.fromCharCode(charCode)
}



const createVar = function(node) {
  const nodeParent = node.parent.nodeWithScope
  const scope = nodeParent.scope
  const varName = generateVariableName(scope)

  scope.addDeclaration(varName, null, 'var')
  nodeParent.prepend((new Chunk()).addMeta('variable').add(`var ${varName};`).line())

  return varName
}

module.exports = {generateVariableName, createVar, transpileParams}
