angular.module('idea-hat.shared.idea-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.user-factory', 'idea-hat.shared.comment-factory'])

.factory("Idea", ["$FirebaseObject", "$firebase", "$f", "User", "Comment",
  function($FirebaseObject, $firebase, $f, User, Comment) {
  var getFactory = function(traceComments, traceOwner, traceCommentsOwner) {
    // create a new factory based on $FirebaseObject
    var IdeaFactory = $FirebaseObject.$extendFactory({
      // TODO: understand how this works
      $$updated: function(snapshot) {
        var self = snapshot.val(); // obtain the data that represents this idea
        if (traceComments) {
          self.commentsD = {};
          for (param in self.comments) {
            self.commentsD[param] = Comment(param, traceCommentsOwner); // obtain each idea
          }
        }
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
      postComment: function(comment) { // this method posts a comment to this idea
        var key = $f.ref().child("comments").push(comment).key();
        // put this comment in the idea on the firebase
        $f.ref().child("ideas").child(this.$id).child("comments").child(key).set("true");
      }
    });
    return IdeaFactory;
  }
  return function(id, traceComments, traceOwner, traceCommentsOwner) {
    if (traceComments == null) {
      traceComments = false;
    }
    if (traceOwner == null) {
      traceOwner = false;
    }
    if (traceCommentsOwner == null) {
      traceCommentsOwner = false;
    }
    // obtain a reference to the firebase at this idea
    var ref = $f.ref().child('ideas').child(id);
    // override the factory used by $firebase
    var sync = $firebase(ref, { objectFactory: getFactory(traceComments, traceOwner, traceCommentsOwner) });
    // this have been created with the IdeaFactory
    return sync.$asObject();
  }
}]);
