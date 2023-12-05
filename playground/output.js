var Debugger = (function () {
  function Debugger() {
  }
  
  Debugger.log = function () {
    console.log(arguments);
  };
  Debugger.timeStart = function () {
    Debugger.startTime = Debugger.now();
  };
  Debugger.now = function () {
    return (typeof performance === 'undefined' ? Date : performance).now();
  };
  Debugger.startTime = undefined;
  
  return Debugger;
}());

module.exports.Debugger = Debugger;

