var Vnode = (function () {
  function Vnode(tag, key, attrs, children, text, dom) {
    return {      
      tag: tag,
      key: key,
      attrs: attrs,
      children: children,
      text: text,
      dom: dom,
      domSize: undefined,
      state: undefined,
      events: undefined,
      instance: undefined,    
    };
  }
  Vnode.normalize = function (vnode) {
    if (Array.isArray(vnode)) return new Vnode('[', undefined, undefined, Vnode.normalizeChildren(vnode), undefined, undefined);
if (vnode == null || typeof vnode === "boolean") return null;
if (typeof vnode === "object") return vnode;
for (var i = 0; i < array.length; i++) {
      children[i] = Vnode.normalize(array[i]);
    }
    return new Vnode("#", undefined, undefined, String(vnode));
  };
  
  return Vnode;
}());

module.exports.Vnode = Vnode