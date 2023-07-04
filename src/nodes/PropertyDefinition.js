const Node = require('./Node')

module.exports = class PropertyDefinition extends Node {
  meta = 'property'

  init() {
    this.parent.scope.addDeclaration(this.node.key.name, this.node, 'property')
  }

  transpile(chunk) {
    if (this.features.includes('instancePublicPrivateFieldsMethodsAccessors')) {
      return this._transpileSupported(chunk)
    }
    return this._transpileUnsupported(chunk)
  }

  _transpileSupported(chunk) {
    // let output = `${this.node.key.name}`

    // if (this.node.value) {
    //   output += ` = ${this.node.value.raw || this.node.value.value}`
    // }

    // return output
  }

  _transpileUnsupported(property) {
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
