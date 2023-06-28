module.exports = {
  features: {
    'es3': [],
    'es5': [
      'getterSetter',
      'octalLiteral',
      'hexadecimalLiteral'
    ],
    'es6': [
      'letConst',
      'arrow',
      'defaultParameter',
      'templateString',
      'destructuring',
      'conciseMethodProperty',
      'generator',
      'classes',
      'moduleExport',
      'moduleImport',
      'spreadRest',
      'forOf',
      'computedProperty',
      'binaryLiteral',
      'newOctalLiteral'
    ],
    'es2016': [
      'exponentiation'
    ],
    'es2017': [
      'asyncAwait',
      'trailingFunctionCommas'
    ],
    'es2018': [
      'objectRestSpread'
    ],
    'es2019': [
      'optionalCatchParam'
    ],
    'es2020': [
      'dynamicImport',
      'namespaceRe-exporting',
      'optionalChaining',
      'nullishCoalescing'
    ],
    'es2021': [
      'logicalAssignmentOperators',
      'underscoresInNumbers'
    ],
    'es2022': [
      'instancePublicPrivateFieldsMethodsAccessors',
      'staticPublicPrivateFieldsMethodsAccessors',
      'topLevelAwait'
    ]
  },
  versions: ['es3', 'es5', 'es6', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022'],
  makeFeaturesList(target) {
    const index = this.versions.indexOf(target)
    const result = []

    for (let i = 0; i <= index; i++) {
      const version = this.versions[i]
      result.push(...this.features[version])
    }

    return result
  }
}
