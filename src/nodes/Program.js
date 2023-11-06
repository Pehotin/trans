const Node = require('./Node')

class Program extends Node {
  init() {
    this.createScope()
  }

  transpile(chunk) {
    const collection = this.traverse(this.node.body)
    return (
      chunk
        .prepend()
        .children(collection.all())
        .append()
    )
  }

  addHelper(helper) {
    if (!this.helpers.includes(helper)) {
      this.helpers.push(helper)
    }
  }
}

module.exports = Program
