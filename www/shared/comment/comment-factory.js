angular.module('idea-hat.shared.comment-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.user-factory'])

.factory("Comment", ["$FirebaseObject", "$firebase", "$f", "User",
  function($FirebaseObject, $firebase, $f, User) {
  var getFactory = function(traceOwner) { // method for obtaining a different factory based on if the ideas or the owner should be traced
    // create a new factory based on $FirebaseObject
    var CommentFactory = $FirebaseObject.$extendFactory({
      // TODO: understand how this works
      $$updated: function(snapshot) {
        var self = snapshot.val(); // obtain the data that represents this idea
        if (traceOwner) { // only trace the owner if told to
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
      }
    });
    return CommentFactory;
  };
  return function(id, traceOwner) {
    // if the trace arguments are not passed, trace by default
    if (traceOwner == null) {
      traceOwner = false;
    }
    // obtain a reference to the firebase at this idea
    var ref = $f.ref().child('comments').child(id);
    // override the factory used by $firebase
    var sync = $firebase(ref, { objectFactory: getFactory(traceOwner) });
    // this have been created with the IdeaFactory
    return sync.$asObject();
  }
}]);
