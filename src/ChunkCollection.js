class ChunkCollection {
  chunks = new Map()

  constructor(chunk) {
    if (chunk) {
      this.chunks.push(chunk)
    }
    return this
  }

  add(chunk) {
    if (!chunk) {
      throw new Error('Chunk not provided')
    }

    if (chunk.meta.length === 0) {
      this._update('default', chunk)
    }

    for (let i = 0; i < chunk.meta.length; i++) {
      const tag = chunk.meta[i]
      this._update(tag, chunk)
    }
    return this
  }

  _update(key, value) {
    if (!this.chunks.has(key)) {
      this.chunks.set(key, [value])
    } else {
      const chunks = this.chunks.get(key)
      chunks.push(value)
    }
  }

  has(...args) {
    const argsNum = args.length
    let matches = 0

    for (const value of this.chunks.keys()) {
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
      return this.chunks.get(args[0])
    }

    const chunks = []

    args.forEach(arg => {
      chunks.push(this.chunks.get(arg))
    })

    const array1 = chunks[0]
    const array2 = chunks[1]

    if (!array1 && !array2) {
      return []
    }

    const intersection = array1.filter(chunk => array2.includes(chunk))

    return intersection
  }

  first(...args) {
    return this.get(...args)[0]
  }

  all() {
    const array = Array.from(this.chunks.values())

    if (array.length === 0) {
      return []
    }
    return array
  }
}

module.exports = ChunkCollection
