class Node {
  static features = null
  static options = null

  static setOptions(options) {
    Node.options = options
  }

  ancestor(level) {
    let node = this

		while (level--) {
			node = node.parent
			if (!node) return null
		}

		return node
  }

  features() {
    return Node.features
  }

  contains(node) {
		while (node) {
			if (node === this) return true
			node = node.parent
		}

		return false
	}

  getScope() {
    let scope = this.parent.scope

    while (!scope) {
      scope = this.parent.getScope()
    }

    return scope
  }

  indent(code) {
    const spaces = Node.options.indentSpaces
    return ' '.repeat(spaces * this.depth) + code
  }
}

module.exports = Node
