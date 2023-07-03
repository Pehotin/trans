const Node = require('./Node')

module.exports = class BlockStatement extends Node {
  meta = 'block'

  init() {
    this.createScope()
  }

  transpile(chunk) {
    const children = this.traverse(this.node.body)
    return (
      chunk
        .add('{')
        .line()
        .indentStart()
        .children(children.all())
        .indentEnd()
        .add('}')
    )
  }
}
