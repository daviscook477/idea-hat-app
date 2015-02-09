angular.module('idea-hat.shared.comment-factory',
  ['firebase', 'idea-hat.shared.f'])

.factory("Comment", ["$FirebaseObject", "$firebase", "$f", "$q", "$injector",
  function($FirebaseObject, $firebase, $f, $q, $injector) {
  var User = $injector.get("User");
  // create a new factory based on $FirebaseObject
  var CommentFactory = $FirebaseObject.$extendFactory({
    loadUser: function() {
      var deffered = $q.defer();
      this.$loaded().then(function(self) {
        self.userD = User(self.owner);
        deffered.resolve(self.userD);
      });
      return deffered.promise;
    },
    // this probably isn't needed because this is the default behavior
    $$updated: function(snapshot) {
      var self = snapshot.val(); // obtain the data that represents this idea
      if (this.userD != null) {
        self.userD = this.userD;
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
