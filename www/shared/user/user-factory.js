angular.module('idea-hat.shared.user-factory',
  ['firebase', 'idea-hat.shared.f'])

.factory("User", ["$FirebaseObject", "$firebase", "$f",
  function($FirebaseObject, $firebase, $f) {
  // create a new factory based on $FirebaseObject
  var UserFactory = $FirebaseObject.$extendFactory({
    // TODO: check if the thing actually changes in $$updated
    $$updated: function(snapshot) {
      var self = snapshot.val();
      if (self == null) {
        self = {};
      }
      if (self.screenName == null) {
        self.screenName = "anonymous";
      }
      // set the properties of self into this
      for (param in self) {
        this[param] = self[param];
      }
      return true;
    }
  });

  return function(id) {
    // obtain a reference to the firebase at this user
    var ref = $f.ref().child('users').child(id);
    // override the factory used by $firebase
    var sync = $firebase(ref, { objectFactory: UserFactory });
    // this have been created with the UserFactory
    return sync.$asObject();
  }
}]);
