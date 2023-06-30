class Error {
  msg = ''
  line = 0
  column = 0

  constructor(msg, line, column) {
    this.msg = msg
    this.line = line
    this.column = column
  }

  toString() {
    return this.msg + ' at line: ' + this.line + ', column: ' + this.column
  }
}

class CompileError extends Error {
  constructor(msg, node) {
    super(
      'Compile Error: ' + msg,
      node.position.start.line,
      node.position.start.column,
    )
  }
}

function compileError(msg, node) {
  throw new CompileError(msg, node)
}

module.exports = { compileError }
