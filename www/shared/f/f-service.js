angular.module('idea-hat.shared.f',
  [])

.factory('$f', [function() {
  var main = new Firebase("https://idea0.firebaseio.com");
  // define the $f object
  function $f() {

  }
  // add some methods to its prototype
  $f.prototype = {
    ref: function() {
      return main;
    },
    authID: function() {
      var curAuth = main.getAuth();
      if (curAuth === null) {
        return null;
      } else {
        return curAuth.uid;
      }
    }
  }
  // return an instance of $f
  return new $f();
}]);
