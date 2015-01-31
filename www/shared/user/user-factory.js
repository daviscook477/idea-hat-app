angular.module('idea-hat.shared.user-factory',
  ['firebase', 'idea-hat.shared.f'])

.factory("User", ["$FirebaseObject", "$firebase", "$f",
  function($FirebaseObject, $firebase, $f) {
  // create a new factory based on $FirebaseObject
  var UserFactory = $FirebaseObject.$extendFactory({
    // TODO: anything to do with an user
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
