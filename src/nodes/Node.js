const Scope = require('../Scope')

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

  get parentScope() {
    if (!this.parent) return null
    return this.parent.scope
  }
}

module.exports = Node
