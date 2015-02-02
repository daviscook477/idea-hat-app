angular.module('idea-hat.shared.category-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.idea-factory'])

.factory("Category", ["$FirebaseObject", "$firebase", "$f", "IdeaList", "User",
  function($FirebaseObject, $firebase, $f, IdeaList, User) {
  var mainRef = $f.ref();
  // create a new factory based on $FirebaseObject
  var CategoryFactory = $FirebaseObject.$extendFactory({
    // TODO: understand how this works
    $$updated: function(snapshot) {
      var self = snapshot.val(); // obtain the data that represents this idea

      // set the properties of self into this
      for (param in self) {
        this[param] = self[param];
      }
      this.userD = User(this.owner);
      return true;
    },
    loadUser: function() {
      if (this.userD == null) {
        this.userD = User(this.owner);
      }
      return this.userD;
    },
    postIdea: function(idea) { // this method posts an idea to this category
      var ideaRef = mainRef.child("ideas").push(idea)
      var key = ideaRef.key(); // add the idea to the category
      mainRef.child("categories").child(this.$id).child("ideas").child(key).set("true");
    },
    // this method tells the idea to load its ideas / provides the caller with the ideas
    loadIdeas: function(snapshot) {
      if (this.ideasD == null) {
        this.ideasD = IdeaList(this.$id);
      }
      return this.ideasD;
    },
    // this method doesn't really need to be here (it just does the default behavior)
    $$updated:function(snapshot) {
      // well it actually may need to preserve the values of commentsD and userD
      var self = snapshot.val();
      self.ideasD = this.ideasD;
      self.userD = this.userD;
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
    var sync = $firebase(ref, { objectFactory: CategoryFactory });
    // this have been created with the IdeaFactory
    return sync.$asObject();
  }
}])
// factory (object) that is a list of ideas associated with an category
.factory("IdeaList",
  ["$FirebaseArray", "$firebase", "$f", "Idea",
  function($FirebaseArray, $firebase, $f, Idea) {
  // create a new factory based on $FirebaseObject
  var mainRef = $f.ref();
  var IdeaListFactory = $FirebaseArray.$extendFactory({
    $$added: function(snapshot) {
      var idea = Idea(snapshot.key());
      if (this.CBS != null) {
        for (var i = 0; i < this.CBS.length; i++) {
          if (this.CBS[i].type === "idea") {
            this.CBS[i].CB(idea);
          }
        }
      }
      return idea;
    },
    $$updated: function(snapshot) {
      var record = this.$getRecord(snapshot.key());
      var idea = Idea(snapshot.key());
      if (this.CBS != null) {
        for (var i = 0; i < this.CBS.length; i++) {
          if (this.CBS[i].type === "idea") {
            this.CBS[i].CB(comment);
          }
        }
      }
      record = idea;
      return true;
    },
    on: function(type, CB) {
      if (this.CBS == null) {
        this.CBS = [];
      }
      this.CBS.push({type: type, CB: CB});
    }
  });
  return function(id) {
    var ref = mainRef.child('categories').child(id).child("ideas");
    var sync = $firebase(ref, { arrayFactory: IdeaListFactory });
    return sync.$asArray();
  }
}]);
