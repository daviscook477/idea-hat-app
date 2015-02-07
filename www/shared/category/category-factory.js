angular.module('idea-hat.shared.category-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.idea-factory'])

.factory("Category", ["$FirebaseObject", "$firebase", "$f", "$q", "IdeaList", "User",
  function($FirebaseObject, $firebase, $f, $q, IdeaList, User) {
  var mainRef = $f.ref();
  // create a new factory based on $FirebaseObject
  var CategoryFactory = $FirebaseObject.$extendFactory({
    loadUser: function() {
      if (this._shouldLoad == null) {
        this._shouldLoad = {};
      }
      this._shouldLoad.user = true;
    },
    postIdea: function(idea) { // this method posts an idea to this category
      var ideaRef = mainRef.child("ideas").push(idea)
      var key = ideaRef.key(); // add the idea to the category
      mainRef.child("categories").child(this.$id).child("ideas").child(key).set("true");
    },
    // this method tells the idea to load its ideas / provides the caller with the ideas
    loadIdeas: function(snapshot) { // so this idea actually sucked
      // I totally should be loading the ideas in this method and then just changing the ideas whenever the pointer changes in $$updated
      console.log("load ideas");
      var deffered = $q.defer();
      if (this._shouldLoad == null) {
        this._shouldLoad = {};
      }
      this._shouldLoad.ideas = true;
      if (this._loadedObjects  == null) {
        this._loadedObjects = {};
      }
      this._loadedObjects.ideas = deffered;
      return deffered.promise;
    },
    // this method doesn't really need to be here (it just does the default behavior)
    $$updated:function(snapshot) {
      // well it actually may need to preserve the values of commentsD and userD
      var self = snapshot.val();
      if (this._shouldLoad != null) {
        if (this._shouldLoad.user) {
          self.userD = User(self.owner); // TODO: check for changes
        }
        if (this._shouldLoad.ideas) {
          console.log("loaded ideas");
          self.ideasD = IdeaList(self.$id);
          this._loadedObjects.ideas.resolve(self.ideasD);
        }
      }
      self._shouldLoad = this._shouldLoad;
      self._loadedObjects = this._loadedObjects;
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
