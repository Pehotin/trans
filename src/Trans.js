const Parker = require('@prender-company/parker')
const Options = require('./Options')
const Program = require('./nodes/Program')
const support = require('./support')
const { writeFileSync } = require('node:fs')
const Chunk = require('./Chunk')
const Node = require('./nodes/Node')
class Trans {
  options = null
  instance = null
  output = ''
  ast = null

  constructor(ast, options) {
    this.options = new Options(options).all
    this.ast = ast
  }

  static pile(source, options) {
    if (!source) throw new Error('Trans error: source not provided')

    let ast

    if (typeof source === 'string') {
      ast = Parker.parse(source, { locations: true })
    } else if (source.type === 'Program') {
      ast = source
    } else {
      throw new Error('Trans error: invalid source type')
    }

    this.instance = new this(ast, options)
    this.instance.transpile()

    if (this.instance.options.output) {
      writeFileSync(this.instance.options.output, this.instance.output)
    }
  }

  transpile() {
    const features = support.makeFeaturesList(this.options.target)
    let chunks

    Node.features = features
    Chunk.setOptions(this.options)

    const instance = new Program()
    instance.node = this.ast
    instance.parent = null

    instance.init()

    try {
      chunks = instance.transpile()
      this.output = this._glue(chunks)
    } catch (error) {
      console.log(error.toString())
    }
  }

  _glue(chunks) {
    const strings = []
    let output = ''

    chunks.forEach(chunk => {
      strings.push(chunk.toString())
    })

    strings.forEach((string, i) => {
      if (i === strings.length - 1) {
        output += string + '\n'
      } else {
        output += string + '\n\n'
      }
    })

    return output
  }
}

module.exports = Trans
