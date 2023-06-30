module.exports.traverse = function(node, parent) {
  const collection = new ChunkCollection()

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const chunk = (new nodeClasses[node[i].type](node[i], parent, parent.depth + 1)).transpile(new Chunk())
      collection.add(chunk)
    }
  } else {
    collection.add((new nodeClasses[node.type](node, parent, parent.depth + 1)).transpile(new Chunk()))
  }
  return collection
}

const Chunk = require('./Chunk')
const ChunkCollection = require('./ChunkCollection')
const nodeClasses = require('./nodes')
