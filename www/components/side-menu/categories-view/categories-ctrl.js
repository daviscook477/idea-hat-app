angular.module('idea-hat.categories.controller', ['idea-hat.shared.f', 'idea-hat.shared.category-factory'])

.controller('CategoriesCtrl', ['$scope', '$state', '$f', 'Category', function($scope, $state, $f, Category) {
  // initialize the $scope with an ideas object
  $scope.categories = {};

  // callback for when the ideas are updated
  var categoriesCB = function(snapshot) {
    var data = snapshot.val();
    for (param in data) { // find each category, param is the key for that category
      $scope.categories[param] = Category(param); // at each key in $scope.categories put an category created from that key
    }
  };

  // listen for changes in the ideas
  $f.ref().child("categories").on("value", categoriesCB);

  $scope.goCategory = function(category) {
    $state.go('app.category', {id: category.$id});
  };
}]);
