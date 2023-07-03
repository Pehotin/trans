const Node = require('./Node')

class Program extends Node {
  init() {
    this.createScope()
  }

  transpile() {
    const collection = this.traverse(this.node.body)
    return collection.all()
  }
}

module.exports = Program
