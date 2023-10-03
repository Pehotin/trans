var { B } = require("/b");
var { Title } = require("Title.vue");
var b = B();
var res = b.add();
console.log(res);
function add(a, b) {
  return a + b;
}

