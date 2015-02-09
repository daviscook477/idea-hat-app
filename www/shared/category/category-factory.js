angular.module('idea-hat.shared.category-factory',
  ['firebase', 'idea-hat.shared.f', 'idea-hat.shared.idea-factory'])

.factory("Category", ["$FirebaseObject", "$firebase", "$f", "$q", "$injector",
  function($FirebaseObject, $firebase, $f, $q, $injector) {
  var mainRef = $f.ref();
  // create a new factory based on $FirebaseObject
  var CategoryFactory = $FirebaseObject.$extendFactory({
    _dependencies: {},
    loadUser: function() {
      if (this._dependencies.User == null) {
        this._dependencies.User = $injector.get('User'); // lazy dependency stuff
      }
      var deffered = $q.defer();
      this.$loaded().then(function(self) {
        self.userD = self._dependencies.User(self.owner);
        deffered.resolve(self.userD);
      });
      return deffered.promise;
    },
    postIdea: function(idea) { // this method posts an idea to this category
      var ideaRef = mainRef.child("ideas").push(idea)
      var key = ideaRef.key(); // add the idea to the category
      mainRef.child("categories").child(this.$id).child("ideas").child(key).set("true");
    },
    // this method tells the idea to load its ideas / provides the caller with the ideas
    loadIdeas: function(snapshot) {
      if (this._dependencies.IdeaList == null) {
        this._dependencies.IdeaList = $injector.get('IdeaList'); // lazy dependency stuff
      }
      var deffered = $q.defer();
      this.$loaded().then(function(self) {
        self.ideasD = self._dependencies.IdeaList(self.$id);
        deffered.resolve(self.ideasD);
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
      self._dependencies = this._dependencies;
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
