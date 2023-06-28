const Node = require('./Node')
const Scope = require('../Scope')
const { traverse } = require('../utils')

class Program extends Node {
  ast = null
  scope = null
  depth = -1

  constructor(ast, features) {
    super()

    this.ast = ast
    this.scope = new Scope(null)

    Node.features = features
  }

  transpile() {
    const collection = traverse(this.ast.body, this)
    return collection.all()
  }
}

module.exports = Program
