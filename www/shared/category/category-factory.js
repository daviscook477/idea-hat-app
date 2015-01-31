angular.module('idea-hat.shared.category-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.idea-factory'])

.factory("Category", ["$FirebaseObject", "$firebase", "$f", "Idea",
  function($FirebaseObject, $firebase, $f, Ideas) {
  // create a new factory based on $FirebaseObject
  var CategoryFactory = $FirebaseObject.$extendFactory({
    // TODO: understand how this works
    $$updated: function(snapshot) {
      var self = snapshot.val(); // obtain the data that represents this idea
      self.ideasD = {};
      for (param in self.ideas) {
        self.ideasD[param] = Idea(param); // obtain each idea
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
    var ref = $f.ref().child('categories').child(id);
    // override the factory used by $firebase
    var sync = $firebase(ref, { objectFactory: IdeaFactory });
    // this have been created with the IdeaFactory
    return sync.$asObject();
  }
}]);
