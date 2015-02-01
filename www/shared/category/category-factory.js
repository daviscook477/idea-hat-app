angular.module('idea-hat.shared.category-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.idea-factory'])

.factory("Category", ["$FirebaseObject", "$firebase", "$f", "Idea",
  function($FirebaseObject, $firebase, $f, Idea) {
  var getFactory = function(traceIdeas, traceOwner) { // method for obtaining a different factory based on if the ideas or the owner should be traced
    // create a new factory based on $FirebaseObject
    var CategoryFactory = $FirebaseObject.$extendFactory({
      // TODO: understand how this works
      $$updated: function(snapshot) {
        var self = snapshot.val(); // obtain the data that represents this idea
        if (traceIdeas) { // only trace the ideas if told to
          self.ideasD = {};
          for (param in self.ideas) {
            self.ideasD[param] = Idea(param); // obtain each idea
          }
        }
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
      },
      postIdea: function(idea) { // this method posts an idea to this category
        var key = $f.ref().child("ideas").push(idea).key();
        // put this idea in the category in the firebase
        $f.ref().child("categories").child(this.$id).child("ideas").child(key).set("true");
      }
    });
    return CategoryFactory;
  };
  return function(id, traceIdeas, traceOwner) {
    // if the trace arguments are not passed, do not trace
    if (traceIdeas == null) {
      traceIdeas = false;
    }
    if (traceOwner == null) {
      traceOwner = false;
    }
    // obtain a reference to the firebase at this idea
    var ref = $f.ref().child('categories').child(id);
    // override the factory used by $firebase
    var sync = $firebase(ref, { objectFactory: getFactory(traceIdeas, traceOwner) });
    // this have been created with the IdeaFactory
    return sync.$asObject();
  }
}]);
