const Node = require('./Node')

module.exports = class SwitchDefault extends Node {
  meta = 'switch-default'

  transpile(chunk) {
    const body = this.traverse(this.node.consequent)

    return (
      chunk
        .add('default')
        .add(':')
        .line()
        .indentStart()
        .children(body.all())
        .indentEnd()
    )
  }
}
