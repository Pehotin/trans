const Node = require('./Node')

module.exports = class CallExpression extends Node {
  meta = 'call-expression'

  transpile(chunk) {
    const callee = this.traverse(this.node.callee)
    const args = this.traverse(this.node.args)

    if (callee.has('super') && !this.features.includes('classes')) {
      chunk
        .add('var _this = _super.call(this')
        .addIf(args.all().length, ', ')
    } else {
      chunk
        .children(callee.all())
        .add('(')
    }

    args.all().forEach((arg, i) => {
      if (i === 0) {
        chunk
          .children([arg])
      } else {
        chunk
          .add(',')
          .space()
          .children([arg])
      }
    })

    return chunk.add(')').addIf(callee.has('super') && !this.features.includes('classes'), ' || this')
  }
}
