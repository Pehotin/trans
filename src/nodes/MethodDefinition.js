const Node = require('./Node')
const Chunk = require('../Chunk')
const { traverse } = require('../utils')

module.exports = class MethodDefinition extends Node {
  node = null
  parent = null
  depth = 0

  constructor(node, parent, depth) {
    super()

    this.node = node
    this.parent = parent
    this.depth = depth

    this.getScope().addProperty(
      parent.node.id.name,
      this.node,
      this.node.key.name,
      this.node.value
    )
  }

  transpile() {
    if (
      (this.node.static || this.node.private || this.node.computed)
      && this.features().includes('instancePublicPrivateFieldsMethodsAccessors')
      && this.features().includes('staticPublicPrivateFieldsMethodsAccessors')
    ) {
      return this._transpileStaticPrivateComputedSupported()
    }

    if (!this.node.static && !this.node.private && !this.node.computed && !this.features().includes('conciseMethodProperty')) {
      return this._transpileUnsupported()
    } else {
      return this._transpileSupported()
    }
  }

  _transpileStaticPrivateComputedSupported() {

  }

  _transpileUnsupported() {

  }

  _transpileSupported() {
    const method = new Chunk()
    const children = traverse(this.node.value.body.body, this)

    method.addMeta('methods')

    if (this.node.key.name === 'constructor') {
      method.addMeta('constructor')
    }

    method.add(`${this.node.key.name} (`)

    this.node.value.params.forEach((param, i) => {
      if (i === 0) {
        method.add(`${param.name}`)
      } else {
        method.add(`, ${param.name}`)
      }
    })

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
}
