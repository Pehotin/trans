const { compileError } = require("./errors")

class Scope {
  parent = null
  declarations = new Map()
  properties = new Map()
  methods = new Map()

  constructor(parent) {
    this.parent = parent
  }

  addDeclaration(name, node, kind) {
    this.declarations.set(kind, [name, node])
  }

  addProperty(className, node, name, value, type) {
    const classProps = this.properties.get(className)

    if (classProps && classProps.includes(name)) {
      compileError(`Duplicate identifier '${name}'`, node)
    }

    if (classProps) {
      classProps.push(name, node, value, type)
      return
    }

    this.properties.set(className, [name, node, value, type])
  }

  addMethod(className, node, name, value) {
    const classMethods = this.methods.get(className)

    if (classMethods && classMethods.includes(name)) {
      compileError(`Duplicate method implementation: '${name}'`, node)
    }

    if (classMethods) {
      classMethods.push(name, node, value)
      return
    }

    this.methods.set(className, [name, node, value])
  }

  contains(name) {
		return (
			this.declarations.has(name) ||
			(this.parent ? this.parent.contains(name) : false)
		)
	}
}

module.exports = Scope
