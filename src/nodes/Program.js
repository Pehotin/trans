const Node = require('./Node')
const { traverse } = require('../utils')

class Program extends Node {
  init() {
    this.createScope()
  }

  transpile() {
    const collection = traverse(this.node.body, this)
    return collection.all()
  }
}

module.exports = Program
