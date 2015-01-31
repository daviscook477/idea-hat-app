angular.module('idea-hat.ideas.controller', [])

.controller('IdeasCtrl', ['$scope', '$state', function($scope, $state) {
  // some test data
  $scope.ideas = [{
    data: {
      title: "Javascript",
      description: 'You should learn javascript in order to be able to better do web programming!'
    }
  }];

  $scope.goIdea = function(idea) {
    $state.go('app.idea', {ID: idea.$id});
  };
}]);
