angular.module('idea-hat.ideas.controller', ['idea-hat.shared.f', 'idea-hat.shared.idea-factory'])

.controller('IdeasCtrl',
  ['$scope', '$state', '$f', 'Idea', '$timeout',
  function($scope, $state, $f, Idea, $timeout) {
  // initialize the $scope with an ideas object
  $scope.ideas = {};

  // callback for when the ideas are updated
  var ideasCB = function(snapshot) {
    $timeout(function() {
      var data = snapshot.val();
      for (param in data) { // find each idea, param is the key for the idea
        // we want to follow the user but we don't need to follow the comments
        $scope.ideas[param] = Idea(param, false, true); // at each key in $scope.ideas put an idea created from that key
      }
    });
  };

  // listen for changes in the ideas
  $f.ref().child("ideas").on("value", ideasCB);

  $scope.goCategories = function() {
    $state.go('app.categories');
  };

  $scope.goIdea = function(idea) {
    $state.go('app.idea', {id: idea.$id});
  };
}]);
