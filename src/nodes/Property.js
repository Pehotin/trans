const Node = require('./Node')

module.exports = class Property extends Node {
  meta = 'property'

  transpile(chunk) {
    if (this.features.includes('computedProperty')) {
      return this._transpileSupported(chunk)
    }
    return this._transpileUnsupported(chunk)
  }

  _transpileSupported(chunk) {
    const key = this.traverse(this.node.key)
    const value = this.traverse(this.node.value)

    if (this.node.computed) {
      chunk.addMeta('computed')
      chunk
        .add('[')
        .children(key.all())
        .add(']')
        .add(':')
        .space()
        .children(value.all())
        .add(',')
    } else if (this.node.shorthand) {
      chunk.addMeta('shorthand')
      chunk
        .children(key.all())
        .add(',')
    } else {
      chunk
        .children(key.all())
        .add(':')
        .space()
        .children(value.all())
        .add(',')
    }

    chunk.line()

    return chunk
  }

  _transpileUnsupported(chunk) {
    const key = this.traverse(this.node.key)
    const value = this.traverse(this.node.value)

    if (this.node.computed) {
      chunk.addMeta('computed')
      chunk
        .add('[')
        .children(key.all())
        .add(']')
        .space()
        .add('=')
        .space()
        .children(value.all())
        .add(',')
    } else {
      chunk
        .children(key.all())
        .add(':')
        .space()
        .children(value.all())
        .add(',')
    }

    return chunk
  }
}
