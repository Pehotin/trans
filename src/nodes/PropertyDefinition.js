const Node = require('./Node')
const Chunk = require('../Chunk')

module.exports = class PropertyDefinition extends Node {
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
      this.node.value,
      this.node.value ? typeof this.node.value.value : null
    )
  }

  transpile() {
    if (this.features().includes('instancePublicPrivateFieldsMethodsAccessors')) {
      return this._transpileSupported()
    }
    return this._transpileUnsupported()
  }

  _transpileSupported() {
    let output = `${this.node.key.name}`

    if (this.node.value) {
      output += ` = ${this.node.value.raw || this.node.value.value}`
    }

    return output
  }

  _transpileUnsupported() {
    const property = new Chunk()
    property.addMeta('properties')

    if (this.node.static) {
      property.addMeta('static')
      property.add(`${this.parent.node.id.name}.${this.node.key.name}`)
    } else {
      property.addMeta('instance')
      property.add(`this.${this.node.key.name}`)
    }

    return property.space().addIf(this.node.value, `= ${this.node.value.raw || this.node.value.value}`).semicolon()
  }
}
