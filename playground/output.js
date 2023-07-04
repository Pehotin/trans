var Test = (function () {
  function Test(a) {
    this.test = 1;
    this.c = undefined;
    if (a === void 0) { a = 2; }
    var b = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      b[_i - 1] = arguments[_i];    
    }
  }
  
  Test.prototype.init = function () {
  };
  
  Test.prototype.get = function () {
    this.kj = false;
  };
  
  Test.test2 = '';
  Test.test3 = 123;
  
  return Test;
}());

{
}

function name(a, c) {
  var _a;
  var _b;
  if (a === void 0) { a = '123'; }
  if (c === void 0) { c = false; }
  var b = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    b[_i - 1] = arguments[_i];  
  }
  (_a = h + 'b') !== null && _a !== void 0 ? _a : 1 + 2;
  (_b = test === null && test === void 0 ? void 0 : test.v) === null && _b === void 0 ? void 0 : _b.c;
}
