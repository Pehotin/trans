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
    const key = this.traverse(this.node.key)
    const value = this.traverse(this.node.value)

    if (this.node.static) {
      property.addMeta('static')
      property.add(`${this.parent.node.id.name}.${this.node.key.name}`)
    } else {
      property.addMeta('instance')

      if (!this.features.includes('class') && this.getFirstParentNode('ClassDeclaration')?.node?.superClass) {
        property
          .add('_this.')
          .children(key.all())
      } else {
        property
          .add('this.')
          .children(key.all())
      }
    }

    if (this.node.value) {
      property
        .space()
        .add('=')
        .space()
        .children(value.all())
    } else {
      property
        .space()
        .add('= undefined')
    }

    return property.semicolon().line()
  }
}
