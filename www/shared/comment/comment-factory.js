angular.module('idea-hat.shared.comment-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.user-factory'])

.factory("Comment", ["$FirebaseObject", "$firebase", "$f", "User",
  function($FirebaseObject, $firebase, $f, User) {
  // create a new factory based on $FirebaseObject
  var CommentFactory = $FirebaseObject.$extendFactory({
    loadUser: function() {
      if (this._shouldLoad == null) {
        this._shouldLoad = {};
      }
      this._shouldLoad.user = true;
    },
    // this probably isn't needed because this is the default behavior
    $$updated: function(snapshot) {
      var self = snapshot.val(); // obtain the data that represents this idea
      if (this._shouldLoad != null) { // TODO: change all of the factories to use this
        if (this._shouldLoad.user) {
          self.userD = User(self.owner);
        }
      }
      // set the properties of self into this
      for (param in self) {
        this[param] = self[param];
      }
      return true;
    }
  });
  return function(id) {
    // obtain a reference to the firebase at this idea
    var ref = $f.ref().child('comments').child(id);
    // override the factory used by $firebase
    var sync = $firebase(ref, { objectFactory: CommentFactory });
    // this have been created with the IdeaFactory
    return sync.$asObject();
  }
}]);
