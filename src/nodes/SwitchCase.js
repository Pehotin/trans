const Node = require('./Node')

module.exports = class SwitchCase extends Node {
  meta = 'switch-case'

  transpile(chunk) {
    const test = this.traverse(this.node.test)
    const body = this.traverse(this.node.consequent)

    return (
      chunk
        .add('case')
        .space()
        .children(test.all())
        .add(':')
        .line()
        .indentStart()
        .children(body.all())
        .indentEnd()
    )
  }
}
