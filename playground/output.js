var Title = (function () {
  function Title() {
    this.props = ['title'];
  
  }
  
  Title.prototype.state = function () {
    return {      
      exists: true,
    };
  };
  
  Title.prototype.mounted = function () {
    console.log('mounted');
  };
  
  
  return Title;
}());

