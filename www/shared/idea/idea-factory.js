angular.module('idea-hat.shared.idea-factory', ['firebase', 'idea-hat.shared.f'])

.factory("Idea", ["$FirebaseObject", "$firebase", "$q", "$f",
  function($FirebaseObject, $firebase, $q, $f) {
  // create a new factory based on $FirebaseObject
  var IdeaFactory = $FirebaseObject.$extendFactory({
    $$added:function(snapshot){
      var self = snapshot.val();
      //self.author = User(self.owner);
      //console.log('self:', self);
      return self;
    },
    /*author:function(){
      return User(this.owner).$loaded();
    }*/
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
