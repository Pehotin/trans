module.exports.traverse = function(node, parent) {
  const collection = new ChunkCollection()
  let nodeInstance

  function addMeta(node, type) {
    if (!node.meta) {
      throw new Error(`Node required to have meta property: ${type}`)
    }
    const chunk = node.transpile(new Chunk())
    chunk.addMeta(node.meta)
    collection.add(chunk)
  }

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      nodeInstance = new nodeClasses[node[i].type]()
      nodeInstance.node = node[i]
      nodeInstance.parent = parent

      if (nodeInstance.init) {
        nodeInstance.init()
      }

      addMeta(nodeInstance, node[i].type)
    }
  } else {
    nodeInstance = new nodeClasses[node.type]()
    nodeInstance.node = node
    nodeInstance.parent = parent

    if (nodeInstance.init) {
      nodeInstance.init()
    }

    addMeta(nodeInstance, node.type)
  }
  return collection
}

const Chunk = require('./Chunk')
const ChunkCollection = require('./ChunkCollection')
const nodeClasses = require('./nodes')
