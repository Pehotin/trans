const Node = require('./Node')
const Chunk = require('../Chunk')

class ClassDeclaration extends Node {
  meta = 'class'

  init() {
    this.createScope()
    this.parent.scope.addDeclaration(this.node.id.name, this.node, 'class')
  }

  transpile(chunk) {
    if (this.features.includes('classes')) {
      return this._transpileSupported(chunk)
    }
    return this._transpileUnsupported(chunk)
  }

  _transpileSupported(classChunk) {
    const chunksCollection = this.traverse(this.node.body)

    classChunk
      .add(`class ${this.node.id.name}`)
      .space()
      .addIf(this.node.superClass, `extends ${this.node.superClass?.name}`)
      .add('{')
      .line()

    if (chunksCollection.has('property', 'instance')) {
      if (!chunksCollection.has('constructor')) {
          classChunk.indentStart()
          classChunk
            .add('constructor() {')
            .line()
            .children(chunksCollection.get('property', 'instance'))
            .line()
            .add('}')
            .line()
          classChunk.indentEnd()
      } else {
        const constructorChunk = chunksCollection.first('method', 'constructor')
        constructorChunk[0].injectAfterFirst('{', chunksCollection.get('property', 'instance'))
        classChunk.add(constructorChunk)
      }
    }

    classChunk
      .add('}')
      .lineIf(chunksCollection.has('property', 'static'), 2)
      .children(chunksCollection.get('property', 'static'))

    return classChunk.line(2)
  }

  _transpileUnsupported(chunk) {
    const children = this.traverse(this.node.body)

    chunk
      .add(`var ${this.node.id.name} = (function (`)
      .addIf(this.node.superClass, '_super')
      .add(')')
      .space()
      .add('{')
      .line(1)
      .indentStart()
      .addIf(this.node.superClass, `__extends(${this.node.id.name}, _super);\n`)

      if (this.node.superClass) {
        const node = this.getFirstParentNode('Program')
        node.prependOnce((new Chunk()).addMeta('__extends').add(
`var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();`
        ).line(2))
      }

    if (children.has('constructor')) {
      const constructor = children.get('method', 'constructor')

      if (this.node.superClass) {
        if (children.has('property', 'instance')) {
          constructor[0].node.append(children.get('property', 'instance'))
        }
        constructor[0].node.append((new Chunk()).add('return _this;').line())
      } else {
        if (children.has('property', 'instance')) {
          constructor[0].injectAfterFirst('{', children.get('property', 'instance'))
        }
      }

      chunk.add(constructor)
    } else {
      chunk
        .add(`function ${this.node.id.name}() {`)
        .line(1)
        .indentStart()
        .addIf(this.node.superClass, 'var _this = _super !== null && _super.apply(this, arguments) || this;')
        .lineIf(this.node.superClass)
        .children(children.get('property', 'instance'))
        .addIf(this.node.superClass, 'return _this;')
        .lineIf(this.node.superClass)
        .indentEnd()
        .add('}')
        .line(2)
    }

    return (
      chunk
        .children(children.get('method', 'instance'))
        .children(children.get('method', 'static'))
        .children(children.get('property', 'static'))
        .line(1)
        .add(`return ${this.node.id.name}`)
        .semicolon()
        .line(1)
        .indentEnd()
        .add('}(')
        .addIf(this.node.superClass, this.node.superClass?.name)
        .add('));')
        .line(2)
    )
  }
}

module.exports = ClassDeclaration
