angular.module('idea-hat.idea.controller',
  ['idea-hat.shared.f',
  'idea-hat.shared.idea-factory'])

.controller('IdeasCtrl',
  ['$scope', '$state', '$stateParams', '$f', 'Idea',
  function($scope, $state, $stateParams, $f, Idea) {
  // initialize the $scope with the idea
  $scope.idea = Idea($stateParams.id);
}]);
