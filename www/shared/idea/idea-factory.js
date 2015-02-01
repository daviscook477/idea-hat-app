angular.module('idea-hat.shared.idea-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.user-factory'])

.factory("Idea", ["$FirebaseObject", "$firebase", "$f", "User",
  function($FirebaseObject, $firebase, $f, User) {
  var getFactory = function(traceOwner) {
    // create a new factory based on $FirebaseObject
    var IdeaFactory = $FirebaseObject.$extendFactory({
      // TODO: understand how this works
      $$updated: function(snapshot) {
        var self = snapshot.val(); // obtain the data that represents this idea
        if (traceOwner) {
          if (self.owner == null) { // null or undefined
            self.ownerD = {
              screenName: "anonymous"
            };
          } else {
            self.ownerD = User(self.owner); // set this idea's author to be a User created with this idea's owner
          }
        }
        // set the properties of self into this
        for (param in self) {
          this[param] = self[param];
        }
        return true;
      },
    });
    return IdeaFactory;
  }
  return function(id, traceOwner) {
    if (traceOwner == null) {
      traceOwner = true;
    }
    // obtain a reference to the firebase at this idea
    var ref = $f.ref().child('ideas').child(id);
    // override the factory used by $firebase
    var sync = $firebase(ref, { objectFactory: getFactory(traceOwner) });
    // this have been created with the IdeaFactory
    return sync.$asObject();
  }
}]);
