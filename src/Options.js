class Options {
  default = {
    target: 'es3',
    output: '',
    indentSpaces: 2
  }

  final = {}

  validOptionChoices = {
    target: ['es3', 'es5', 'es6', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022'],
  }

  validTypes = {
    output: 'string'
  }

  constructor(options)  {
    if (!options) {
      this.final = Object.assign(this.default, {})
      return
    }
    this.final = Object.assign(this.default, options)
    this.validateOptionChoices()
    this.validateTypes()
  }

  validateOptionChoices() {
    try {
      for (const key in this.final) {
        if (!this.validOptionChoices[key]) continue

        if (!this.validOptionChoices[key].includes(this.final[key])) {
          throw new Error(`Option ${key} has invalid value. Possible values: ${this.validOptionChoices[key].join(',')}.`)
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  validateTypes() {
    try {
      for (const key in this.final) {
        if (!this.validTypes[key]) continue

        if (typeof this.final[key] !== this.validTypes[key]) {
          throw new Error(`Option ${key} has invalid type "${typeof this.final[key]}". Possible types: ${this.validTypes[key]}.`)
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  get all() {
    return this.final
  }
}

module.exports = Options
