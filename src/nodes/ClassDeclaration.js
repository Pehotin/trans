const Node = require('./Node')

class ClassDeclaration extends Node {
  meta = 'class'

  init() {
    this.createScope()
    this.parent.scope.addDeclaration(this.node.id.name, this.node, 'class')
  }

  transpile(chunk) {
    if (this.features.includes('classes')) {
      return this._transpileSupported(chunk)
    }
    return this._transpileUnsupported(chunk)
  }

  _transpileSupported(classChunk) {
    const chunksCollection = this.traverse(this.node.body)

    classChunk
      .add(`class ${this.node.id.name}`)
      .space()
      .addIf(this.node.superClass, `extends ${this.node.superClass?.name}`)
      .add('{')
      .line()

    if (chunksCollection.has('property', 'instance')) {
      if (!chunksCollection.has('constructor')) {
          classChunk.indentStart()
          classChunk
            .add('constructor() {')
            .line()
            .children(chunksCollection.get('property', 'instance'))
            .line()
            .add('}')
            .line()
          classChunk.indentEnd()
      } else {
        const constructorChunk = chunksCollection.first('method', 'constructor')
        constructorChunk[0].injectAfterFirst('{', chunksCollection.get('property', 'instance'))
        classChunk.add(constructorChunk)
      }
    }

    classChunk
      .add('}')
      .lineIf(chunksCollection.has('property', 'static'), 2)
      .children(chunksCollection.get('property', 'static'))

    return classChunk.line(2)
  }

  _transpileUnsupported(chunk) {
    const children = this.traverse(this.node.body)

    chunk
      .add(`var ${this.node.id.name} = (function ()`)
      .space()
      .add('{')
      .line(1)
      .indentStart()

      if (children.has('constructor')) {
        const constructor = children.get('method', 'constructor')

        if (children.has('property', 'instance')) {
          constructor[0].injectAfterFirst('{', children.get('property', 'instance'))
        }

        chunk.add(constructor)
      } else {
        chunk
          .add(`function ${this.node.id.name}() {`)
          .line(1)
          .indentStart()
          .children(children.get('property', 'instance'))
          .indentEnd()
          .line(1)
          .add('}')
          .line(2)
      }

      return (
        chunk
          .children(children.get('method', 'instance'))
          .children(children.get('method', 'static'))
          .children(children.get('property', 'static'))
          .line(1)
          .add(`return ${this.node.id.name}`)
          .semicolon()
          .line(1)
          .indentEnd()
          .add('}());')
          .line(2)
      )
  }
}

module.exports = ClassDeclaration
