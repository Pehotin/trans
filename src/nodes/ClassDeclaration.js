const { traverse } = require('../utils')
const Node = require('./Node')
const Chunk = require('../Chunk')

class ClassDeclaration extends Node {
  node = null
  parent = null
  depth = 0

  constructor(node, parent) {
    super()

    this.node = node
    this.parent = parent
    this.depth = parent.depth + 1

    this.getScope().addDeclaration(this.node.id.name, this.node, 'class')
  }

  transpile() {
    if (this.features().includes('classes')) {
      return this._transpileSupported()
    }
    return this._transpileUnsupported()
  }

  _transpileSupported() {
    const classChunk = new Chunk(`class ${this.node.id.name}`)
    const chunksCollection = traverse(this.node.body, this)

    classChunk
      .addMeta('class')
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

  _transpileUnsupported() {
    console.log('test')
    //TEMP
    // let output = `class ${this.node.id.name} `

    // if (this.node.superClass) {
    //   output += `extends ${this.node.superClass.name} `
    // }

    // output += '{'
    // output += transpileChildren(this.node.body, this)
    // output += '}'

    // return output
  }
}

module.exports = ClassDeclaration
