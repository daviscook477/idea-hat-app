angular.module('idea-hat.profile.controller',
  ['idea-hat.shared.f',
  'idea-hat.shared.user-factory'])

.controller('IdeaCtrl',
  ['$scope', '$state', '$stateParams', '$f', 'User',
  function($scope, $state, $stateParams, $f, User) {
  // initialize the $scope with the idea
  $scope.user = User($stateParams.id);
}]);
