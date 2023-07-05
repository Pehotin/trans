const Scope = require('../Scope')
const Chunk = require('../Chunk')
const ChunkCollection = require('../ChunkCollection')

class Node {
  static features = null
  _scope = null

  ancestor(level) {
    let node = this

		while (level--) {
			node = node.parent
			if (!node) return null
		}

		return node
  }

  get features() {
    return Node.features
  }

  contains(node) {
		while (node) {
			if (node === this) return true
			node = node.parent
		}

		return false
	}

  createScope() {
    return this.scope = new Scope(this.scope)
  }

  get scope() {
    if (this._scope) return this._scope
    if (!this.parent) return null

    return this.parent.scope
  }

  set scope(val) {
    this._scope = val
  }

  get nodeWithScope() {
    if (this._scope) return this
    if (!this.parent) return this

    return this.parent.nodeWithScope
  }

  prepend(chunk) {
    this.chunk._prepend.push(chunk)
  }

  append(chunk) {
    this.chunk._append.push(chunk)
  }

  traverse(node) {
    const collection = new ChunkCollection()
    const nodeClasses = require('./index')
    const parent = this
    let nodeInstance

    function addMeta(node, type) {
      if (!node.meta) {
        throw new Error(`Node required to have meta property: ${type}`)
      }
      let chunk = new Chunk()
      node.chunk = chunk
      chunk = node.transpile(chunk)
      chunk.addMeta(node.meta)
      collection.add(chunk)
    }

    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        if (node[i].type === 'EmptyStatement') {
          continue
        }

        nodeInstance = new nodeClasses[node[i].type]()
        nodeInstance.node = node[i]
        nodeInstance.parent = parent

        if (nodeInstance.init) {
          nodeInstance.init()
        }

        addMeta(nodeInstance, node[i].type)
      }
    } else {
      try {
        if (node.type === 'EmptyStatement') {
          return collection
        }

        nodeInstance = new nodeClasses[node.type]()
        nodeInstance.node = node
        nodeInstance.parent = parent

        if (nodeInstance.init) {
          nodeInstance.init()
        }

        addMeta(nodeInstance, node.type)
      } catch (error) {
        throw new Error(error + ': ' + node.type)
      }
    }
    return collection
  }
}

module.exports = Node
