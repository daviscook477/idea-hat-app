angular.module('idea-hat.ideas.controller', ['idea-hat.shared.f', 'idea-hat.shared.idea-factory'])

.controller('IdeasCtrl', ['$scope', '$state', '$f', 'Idea', function($scope, $state, $f, Idea) {
  // callback for when the ideas are updated
  var ideasCB = function(snapshot) {
    $scope.ideas = {};
    var data = snapshot.val();
    for (param in data) { // find each idea, param is the key for the idea
      $scope.ideas[param] = Idea(param); // at each key in $scope.ideas put an idea created from that key
    }
  };

  // listen for changes in the ideas
  $f.ref().child("ideas").on("value", ideasCB);

  $scope.goIdea = function(idea) {
    $state.go('app.idea', {id: idea.$id});
  };
}]);
