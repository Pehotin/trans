class ChunkCollection {
  tags = new Map()
  _chunks = []

  constructor(chunk) {
    if (chunk) {
      this._chunks.push(chunk)
    }
    return this
  }

  add(chunk) {
    if (!chunk) {
      throw new Error('Chunk not provided')
    }

    this._chunks.push(chunk)
    const index = this._chunks.length - 1

    for (let i = 0; i < chunk.meta.length; i++) {
      const tag = chunk.meta[i]
      this._update(tag, index)
    }
  }

  _update(key, value) {
    if (!this.tags.has(key)) {
      this.tags.set(key, [value])
    } else {
      const chunks = this.tags.get(key)
      chunks.push(value)
    }
  }

  has(...args) {
    const argsNum = args.length
    let matches = 0

    for (const value of this.tags.keys()) {
      if (args.includes(value)) {
        matches++
      }
    }

    return argsNum === matches ? true : false
  }

  get(...args) {
    if (args.length === 0) {
      throw new Error('Meta tag not provided')
    }

    if (args.length === 1) {
      const out = []
      const indexes = this.tags.get(args[0])

      if (!indexes) {
        return []
      }

      indexes.forEach(index => {
        out.push(this._chunks[index])
      })
      return out
    }

    const arraysOfIndexes = []

    args.forEach(arg => {
      arraysOfIndexes.push(this.tags.get(arg))
    })

    const array1 = arraysOfIndexes[0]
    const array2 = arraysOfIndexes[1]

    if (!array1 || !array2) {
      return []
    }

    const intersection = array1.filter(index => array2.includes(index))
    const out = []

    intersection.forEach(index => {
      out.push(this._chunks[index])
    })

    return out
  }

  each(callback) {
    const chunks = this.all()

    chunks.forEach((chunk, i) => {
      if (Array.isArray(chunk)) {
        chunk.forEach((c, index) => {
          callback(c, i + index)
        })
      } else {
        callback(chunk, i)
      }
    })
  }

  last() {
    return this._chunks[this._chunks.length - 1]
  }

  all() {
    return this._chunks
  }
}

module.exports = ChunkCollection
