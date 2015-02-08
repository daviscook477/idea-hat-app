angular.module('idea-hat.shared.idea-factory',
  ['firebase',
  'idea-hat.shared.f',
  'idea-hat.shared.user-factory',
  'idea-hat.shared.comment-factory'])

.factory("Idea", ["$FirebaseObject", "$firebase", "$f", "$q", "User", "CommentList",
  function($FirebaseObject, $firebase, $f, $q, User, CommentList) {
  // create a new factory based on $FirebaseObject
  var mainRef = $f.ref();
  var IdeaFactory = $FirebaseObject.$extendFactory({
    // this method tells the idea to load its user
    loadUser: function() {
      var deffered = $q.defer();
      this.$loaded().then(function(self) {
        self.userD = User(self.owner);
        deffered.resolve(self.userD);
      });
      return deffered.promise;
    },
    postComment: function(comment) { // this method posts a comment to this idea
      var commentRef = mainRef.child("comments").push(comment)
      var key = commentRef.key(); // add the idea to the category
      mainRef.child("ideas").child(this.$id).child("comments").child(key).set("true");
    },
    // this method tells the idea to load its comments / provides the caller with the comments
    loadComments: function() {
      var deffered = $q.defer();
      this.$loaded().then(function(self) {
        self.commentsD = CommentList(self.$id);
        deffered.resolve(self.commentsD);
      });
      return deffered.promise;
    },
    // this method doesn't really need to be here (it just does the default behavior)
    $$updated:function(snapshot) {
      // well it actually may need to preserve the values of commentsD and userD
      var self = snapshot.val();
      if (this.userD != null) {
        self.userD = this.userD;
      }
      if (this.commentsD != null) {
        self.commentsD = this.commentsD;
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
    var ref = mainRef.child('ideas').child(id);
    // override the factory used by $firebase
    var sync = $firebase(ref, { objectFactory: IdeaFactory });
    // this have been created with the IdeaFactory
    return sync.$asObject();
  }
}])

// factory (object) that is a list of comments associated with an idea
.factory("CommentList",
  ["$FirebaseArray", "$firebase", "$f", "Comment",
  function($FirebaseArray, $firebase, $f, Comment) {
  // create a new factory based on $FirebaseObject
  var mainRef = $f.ref();
  // so this here creates an array of comments that updates with changes to the ideas comments
  var CommentListFactory = $FirebaseArray.$extendFactory({
    // overide the $$added and $$updated methods such that they return comment objects instead of what would normally be in the snapshot
    $$added: function(snapshot) {
      var comment = Comment(snapshot.key());  // create a comment from the idea that this array is on
      if (this.CBS != null) {
        for (var i = 0; i < this.CBS.length; i++) { // notify the callbacks
          if (this.CBS[i].type === "comment") {
            this.CBS[i].CB(comment);
          }
        }
      }
      return comment;
    },
    $$updated: function(snapshot) {
      var record = this.$getRecord(snapshot.key()); // destroy the comment that was there before
      var comment = Comment(snapshot.key());  // create a comment from the idea that this array is on
      if (this.CBS != null) {
        for (var i = 0; i < this.CBS.length; i++) { // notify the callbacks
          if (this.CBS[i].type === "comment") {
            this.CBS[i].CB(comment);
          }
        }
      }
      record = comment; // set this record to be a new comment from the snapshot
      return true;
    },
    on: function(type, CB) { // allow for listening to changes
      if (this.CBS == null) {
        this.CBS = [];
      }
      this.CBS.push({type: type, CB: CB}); // add this to the callbacks
    }
  });
  return function(id) {
    // obtain a reference to the firebase at this comment
    var ref = mainRef.child('ideas').child(id).child("comments");
    // override the factory used by $firebase
    var sync = $firebase(ref, { arrayFactory: CommentListFactory });
    // this have been created with the CommentFactory
    return sync.$asArray();
  }
}]);
