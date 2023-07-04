const Node = require('./Node')

module.exports = class ThisExpression extends Node {
  meta = 'this-expression'

  transpile(chunk) {
    return chunk.add('this')
  }
}
