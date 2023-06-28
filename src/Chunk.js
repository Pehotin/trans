const { compileError } = require("./errors")

class Chunk {
  strings = []
  _meta = []
  indent = 0

  constructor(string) {
    if (string) {
      this.strings.push(string)
    }
    return this
  }

  get meta() {
    return this._meta
  }

  addMeta(value) {
    if (Array.isArray(value)) {
      this._meta = array
    } else {
      this._meta.push(value)
    }
    return this
  }

  add(string) {
    this._push(string)
    return this
  }

  children(array) {
    if (!Array.isArray(array)) {
      throw new Error('Chunk: children argument not an array')
    }

    array.forEach(chunk => {
      this._push(chunk)
    })
    return this
  }

  _push(string) {
    if (this.indent) {
      this.strings.push('  ', string)
    } else {
      this.strings.push(string)
    }
  }

  addIf(condition, string) {
    if (condition) {
      this.add(string)
    }
    return this
  }

  injectAfterFirst(string, chunks) {
    const index = this.strings.indexOf(string)

    if (index > -1) {
      this.strings.splice(index + 1, 0, chunks)
    }

    return this
  }

  injectAfterLast(string) {
    const index = this.strings.lastIndexOf(string)

    if (index > -1) {
      this.strings.splice(index, 0, string)
    }

    return this
  }

  injectBeforeFirst(string) {
    const index = this.strings.indexOf(string)

    if (index > -1) {
      this.strings.splice(index - 1, 0, string)
    }

    return this
  }

  injectBeforeLast(string) {
    const index = this.strings.lastIndexOf(string)

    if (index > -1) {
      this.strings.splice(index - 1, 0, string)
    }

    return this
  }

  indentStart() {
    this.indent++
  }

  indentEnd() {
    this.indent--
  }

  line(number) {
    if (!number) {
      this.strings.push('\n')
      return this
    }

    for (let i = 0; i < number; i++) {
      this.strings.push('\n')
    }

    return this
  }

  lineIf(condition, number) {
    if (condition) {
      this.line(number)
    }
    return this
  }

  space() {
    this.strings.push(' ')
    return this
  }

  semicolon() {
    this.strings.push(';')
    return this
  }

  toString() {
    let output = ''

    this.strings.forEach(string => {
      if (string instanceof Chunk) {
        output += string.toString()
      } else if (Array.isArray(string)) {
        string.forEach(val => {
          if (val instanceof Chunk) {
            output += string.toString()
          } else {
            output += string
          }
        })
      } else {
        output += string
      }
    })

    return output
  }
}

module.exports = Chunk
