const { traverse } = require('../utils')
const Node = require('./Node')

class ClassDeclaration extends Node {
  node = null
  parent = null

  constructor(node, parent) {
    super()

    this.node = node
    this.parent = parent

    this.getScope().addDeclaration(this.node.id.name, this.node, 'class')
  }

  transpile(chunk) {
    if (this.features.includes('classes')) {
      return this._transpileSupported(chunk)
    }
    return this._transpileUnsupported(chunk)
  }

  _transpileSupported(classChunk) {
    const chunksCollection = traverse(this.node.body, this)

    classChunk
      .addMeta('class')
      .add(`class ${this.node.id.name}`)
      .space()
      .addIf(this.node.superClass, `extends ${this.node.superClass?.name}`)
      .add('{')
      .line()

    if (chunksCollection.has('properties', 'instance')) {
      if (!chunksCollection.has('constructor')) {
          classChunk.indentStart()
          classChunk
            .add('constructor() {')
            .line()
            .children(chunksCollection.get('properties', 'instance'))
            .line()
            .add('}')
            .line()
          classChunk.indentEnd()
      } else {
        const constructorChunk = chunksCollection.first('methods', 'constructor')
        constructorChunk.injectAfterFirst('{', chunksCollection.get('properties', 'instance'))
        classChunk.add(constructorChunk)
      }
    }

    classChunk
      .add('}')
      .lineIf(chunksCollection.has('properties', 'static'), 2)
      .children(chunksCollection.get('properties', 'static'))

    return classChunk
  }

  _transpileUnsupported(chunk) {
    const children = traverse(this.node.body, this)

    chunk
      .addMeta('class')
      .add(`var ${this.node.id.name} = (function ()`)
      .space()
      .add('{')
      .line(1)
      .indentStart()

      if (children.has('constructor')) {
        const constructor = children.first('methods', 'constructor')

        constructor.injectAfterFirst('{', children.get('properties', 'instance'))
        chunk.add(constructor)
      } else {

      }

      return (
        chunk
          .children(children.get('methods', 'instance'))
          .children(children.get('properties', 'static'))
          .line(1)
          .add(`return ${this.node.id.name}`)
          .semicolon()
          .line(1)
          .indentEnd()
          .add('}());')
      )
  }
}

module.exports = ClassDeclaration
