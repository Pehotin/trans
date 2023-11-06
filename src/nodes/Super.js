const Node = require('./Node')

module.exports = class Super extends Node {
  meta = 'super'

  transpile(chunk) {
    return chunk.add('super')
  }
}
