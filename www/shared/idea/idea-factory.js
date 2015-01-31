angular.module('idea-hat.shared.idea-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.user-factory'])

.factory("Idea", ["$FirebaseObject", "$firebase", "$q", "$f", "User",
  function($FirebaseObject, $firebase, $q, $f, User) {
  // create a new factory based on $FirebaseObject
  var IdeaFactory = $FirebaseObject.$extendFactory({
    // TODO: understand how this works
    $$updated: function(snapshot) {
      var self = snapshot.val(); // obtain the data that represents this idea
      self.author = User(self.owner); // set this idea's author to be a User created with this idea's owner
      for (param in self) {
        this[param] = self[param];
      }
      return true;
    },
    // the author of the idea. this gets override when the $$added method fires
    author: function() {
      return User(this.owner).$loaded();
    }
  });

  return function(id) {
    // obtain a reference to the firebase at this idea
    var ref = $f.ref().child('ideas').child(id);
    // override the factory used by $firebase
    var sync = $firebase(ref, { objectFactory: IdeaFactory });
    // this have been created with the IdeaFactory
    return sync.$asObject();
  }
}]);
