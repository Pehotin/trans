module.exports.traverse = function(node, parent) {
  const collection = new ChunkCollection()

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const chunk = (new nodeClasses[node[i].type](node[i], parent, parent.depth + 1)).transpile()
      collection.add(chunk)
    }
    return collection
  } else {
    return collection.add((new nodeClasses[node.type](node, parent, parent.depth + 1)).transpile())
  }
}

const ChunkCollection = require('./ChunkCollection')
const nodeClasses = require('./nodes')
