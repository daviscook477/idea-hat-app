angular.module('idea-hat.category.controller', ['idea-hat.shared.f', 'idea-hat.shared.category-factory'])

.controller('CategoryCtrl', ['$scope', '$state', '$stateParams', '$f', 'Category', function($scope, $state, $stateParams, $f, Category) {
  // initialize the $scope with a category object
  $scope.category = Category($stateParams.id);

  $scope.goIdea = function(idea) {
    $state.go('app.idea', {id: idea.$id});
  };
}]);
