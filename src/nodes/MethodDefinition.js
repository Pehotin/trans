const { transpileParams } = require('../utils')
const Node = require('./Node')

module.exports = class MethodDefinition extends Node {
  meta = 'method'

  init() {
    this.createScope()
    this.parent.scope.addDeclaration(this.node.key.name, this.node, 'method')
  }

  transpile(chunk) {
    if (
      (this.node.static || this.node.private || this.node.computed)
      && this.features.includes('instancePublicPrivateFieldsMethodsAccessors')
      && this.features.includes('staticPublicPrivateFieldsMethodsAccessors')
    ) {
      return this._transpileStaticPrivateComputedSupported(chunk)
    } else {
      return this._transpileUnsupported(chunk)
    }
  }

  _transpileStaticPrivateComputedSupported(chunk) {
    // TODO
  }

  _transpileUnsupported(chunk) {
    const children = this.traverse(this.node.value.body.body)
    const extras = []

    if (this.node.key.name === 'constructor') {
      chunk
        .addMeta('constructor')
        .add(`function ${this.parent.node.id.name}(`)
    } else {
      if (this.node.static) {
        chunk.addMeta('static')
        chunk.add(`${this.parent.node.id.name}.${this.node.key.name} = function (`)
      } else {
        chunk.addMeta('instance')
        chunk.add(`${this.parent.node.id.name}.prototype.${this.node.key.name} = function (`)
      }
    }

    transpileParams(this.node.value.params, chunk, this, extras)

    chunk
      .add(')')
      .space()
      .add('{')
      .line()
      .indentStart()
      .prepend()

    if (extras.length > 0) {
      chunk.children(extras)
    }

    chunk
      .children(children.all())
      .append()
      .indentEnd()
      .add('}')
      .semicolonIf(this.node.key.name !== 'constructor')
      .line(2)

    return chunk
  }

  _transpileSupported(method) {
    const children = this.traverse(this.node.value.body.body)
    const extras = []

    if (this.node.key.name === 'constructor') {
      method.addMeta('constructor')
    }

    method.add(`${this.node.key.name} (`)

    transpileParams(this.node.value.params, method, this, extras)

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
