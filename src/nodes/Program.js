const Node = require('./Node')
const Scope = require('../Scope')
const { traverse } = require('../utils')

class Program extends Node {
  ast = null
  scope = null

  constructor(ast) {
    super()

    this.ast = ast
    this.scope = new Scope()
  }

  transpile() {
    const collection = traverse(this.ast.body, this)
    return collection.all()
  }
}

module.exports = Program
