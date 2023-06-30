class Chunk {
  strings = []
  _meta = []
  indent = 0

  static options = null

  static setOptions(options) {
    Chunk.options = options
  }

  constructor() {
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
    this.strings.push(string)
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
      let inc = 1
      while (this.strings[index + inc] === '\n' || this.strings[index + inc] === '--indentStart--') {
        inc++
      }
      this.strings.splice(index + inc, 0, chunks)
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
    this._push('--indentStart--')
    return this
  }

  indentEnd() {
    this._push('--indentEnd--')
    return this
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

  semicolonIf(condition) {
    if (condition) {
      this.semicolon()
    }
    return this
  }

  toString(prevString) {
    let output = ''
    let self = this

    function _doIndent(string, i, prevChunkLastString) {
      const spaces = Chunk.options.indentSpaces

      if (prevChunkLastString === '\n' || prevChunkLastString === '--indentStart--' || prevChunkLastString === '--indentEnd--') {
        string = ' '.repeat(spaces * self.indent) + string
      }

      return string
    }

    function _getPrevString(index, prevString) {
      let prev = self.strings[index - 1]

      if (prev instanceof Chunk) {
        prev = prev.strings[prev.strings.length - 1]
      } else if (Array.isArray(prev)) {
        prev = prev[prev.length - 1]
        prev = prev.strings[prev.strings.length - 1]
      } else if (prev === undefined) {
        prev = prevString
      }
      return prev
    }

    this.strings.forEach((string, i) => {
      if (string === '--indentStart--') {
        this.indent++
        return
      }

      if (string === '--indentEnd--') {
        this.indent--
        return
      }

      if (string instanceof Chunk) {
        string.indent = this.indent
        output += string.toString(_getPrevString(i, prevString))
        return
      }

      if (Array.isArray(string)) {
        string.forEach(val => {
          val.indent = this.indent
          output += val.toString(_getPrevString(i, prevString))
        })
        return
      }

      output += _doIndent(string, i, _getPrevString(i, prevString))
    })

    return output
  }
}

module.exports = Chunk
