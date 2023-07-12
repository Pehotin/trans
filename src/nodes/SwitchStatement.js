const Node = require('./Node')

module.exports = class SwitchStatement extends Node {
  meta = 'switch-statement'

  transpile(chunk) {
    const condition = this.traverse(this.node.condition)
    const cases = this.traverse(this.node.cases)

    return (
      chunk
        .add('switch')
        .space()
        .add('(')
        .children(condition.all())
        .add(')')
        .space()
        .add('{')
        .line()
        .indentStart()
        .children(cases.all())
        .indentEnd()
        .add('}')
    )
  }
}
