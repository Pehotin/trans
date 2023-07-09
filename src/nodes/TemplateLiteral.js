const Node = require('./Node')

module.exports = class TemplateLiteral extends Node {
  meta = 'template-literal'

  transpile(chunk) {
    const nodes = []

    nodes.push(...this.node.expressions)
    nodes.push(...this.node.quasis)

    nodes.sort((a, b) => {
      return a.start - b.start
    })

    nodes.forEach((node, i, arr) => {
      const chunkChild = this.traverse(node).first()

      if (i === 0) {
        if (chunkChild.hasMeta('template-element')) {
          chunk.add('"').children([chunkChild]).add('"')
          return
        }
        chunk.add('""')
      }

      if (!chunkChild.hasMeta('template-element')) {
        chunk.add('.concat(').children([chunkChild])

        if (arr[i + 1] && arr[i + 1].type !== 'TemplateElement') {
          chunk.add(')')
        }
        return
      }

      chunk.add(', ').add('"').children([chunkChild]).add('"').add(')')
    })

    return chunk
  }
}
