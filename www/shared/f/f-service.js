angular.module('idea-hat.shared.f', [])

.factory('$f', [function() {
  var main = new Firebase("https://idea0.firebaseio.com");
  // define the $f object
  function $f() {

  }
  // add some methods to its prototype
  $f.prototype = {
    ref: function() {
      return main;
    }
  }
  // return an instance of $f
  return new $f();
}]);
