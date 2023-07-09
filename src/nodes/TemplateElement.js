const Node = require('./Node')

module.exports = class TemplateElement extends Node {
  meta = 'template-element'

  transpile(chunk) {
    return chunk.add(this.node.value.cooked)
  }
}
