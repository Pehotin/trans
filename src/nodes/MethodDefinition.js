const Node = require('./Node')
const Chunk = require('../Chunk')
const { traverse } = require('../utils')

module.exports = class MethodDefinition extends Node {
  node = null
  parent = null

  constructor(node, parent) {
    super()

    this.node = node
    this.parent = parent

    this.getScope().addProperty(
      parent.node.id.name,
      this.node,
      this.node.key.name,
      this.node.value
    )
  }

  transpile(chunk) {
    if (
      (this.node.static || this.node.private || this.node.computed)
      && this.features.includes('instancePublicPrivateFieldsMethodsAccessors')
      && this.features.includes('staticPublicPrivateFieldsMethodsAccessors')
    ) {
      return this._transpileStaticPrivateComputedSupported(chunk)
    }

    if (!this.node.static && !this.node.private && !this.node.computed && !this.features.includes('conciseMethodProperty')) {
      return this._transpileUnsupported(chunk)
    } else {
      return this._transpileSupported(chunk)
    }
  }

  _transpileStaticPrivateComputedSupported(chunk) {

  }

  _transpileUnsupported(chunk) {
    const children = traverse(this.node.value.body.body, this)

    chunk.addMeta('methods')

    if (this.node.key.name === 'constructor') {
      chunk
        .addMeta('constructor')
        .add(`function ${this.parent.node.id.name}(`)
    } else {
      chunk.addMeta('instance')

      chunk
        .add(`${this.parent.node.id.name}.prototype.${this.node.key.name} = function (`)
    }

    this._params(chunk)

    return (
      chunk
        .add(')')
        .space()
        .add('{')
        .line()
        .indentStart()
        .children(children.all())
        .indentEnd()
        .add('}')
        .semicolonIf(this.node.key.name !== 'constructor')
        .line(2)
    )
  }

  _transpileSupported(method) {
    const children = traverse(this.node.value.body.body, this)

    method.addMeta('methods')

    if (this.node.key.name === 'constructor') {
      method.addMeta('constructor')
    }

    method.add(`${this.node.key.name} (`)
    this._params(method)

    method
      .add(')')
      .space()
      .add('{')
      .line()
      .children(children.all())
      .line()
      .add('}')

    return method
  }

  _params(chunk) {
    this.node.value.params.forEach((param, i) => {
      if (i === 0) {
        chunk.add(`${param.name}`)
      } else {
        chunk.add(`, ${param.name}`)
      }
    })
  }
}
