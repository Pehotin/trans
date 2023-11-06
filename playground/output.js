var EventEmitter = (function () {
  function EventEmitter(test, a) {
  }
  EventEmitter.prototype.emit = function () {
  };
  
  return EventEmitter;
}());

var DefaultDiffer = (function (_super) {
  __extends(DefaultDiffer, _super);
function DefaultDiffer() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    return _this;
  }
  
  DefaultDiffer.prototype.process = function () {
    this.emit();
  };
  
  return DefaultDiffer;
}(EventEmitter));

module.exports.DefaultDiffer = DefaultDiffer;

