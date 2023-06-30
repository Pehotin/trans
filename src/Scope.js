const { compileError } = require("./errors")

class Scope {
  parent = null
  declarations = new Map()
  properties = new Map()
  methods = new Map()

  constructor(parent) {
    if (parent) {
      this.parent = parent
    }
  }

  addDeclaration(name, node, kind) {
    if (this.contains(name)) {
      compileError(`Duplicate identifier '${name}'`, node)
    }
    this.declarations.set(name, [node, kind])
  }

  contains(name) {
		return this.declarations.has(name)
	}
}

module.exports = Scope
