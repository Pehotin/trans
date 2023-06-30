const Node = require('./Node')
const Chunk = require('../Chunk')

module.exports = class PropertyDefinition extends Node {
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

    property.space()

    if (this.node.value) {
      if (this.node.value.type === 'Literal') {
        if (this.node.value.raw !== undefined && this.node.value.raw !== null) {
          property.add(`= ${this.node.value.raw}`)
        } else {
          property.add(`= ${this.node.value.value}`)
        }
      } else if (this.node.type === 'Identifier') {
        property.add(`= ${this.node.value.name}`)
      }
    } else {
      property.add('= undefined')
    }

    return property.semicolon().line()
  }
}
