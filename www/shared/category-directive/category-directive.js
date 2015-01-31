angular.module('idea-hat.shared.category-directive', [])

.directive('ideaHatCategory', [function() {
  var link = function($scope, element, attrs) {
    // watch for when this directive is destroyed
    $scope.$on("destroy", function() {

    });
  };
  // return the directive
  return {
    link: link, // the link
    scope: {
      category: '='
    }, // create a new isolate scope
    templateUrl: 'shared/category-directive/category-directive.html' //this directive adds in this html in place of it
  };
}]);
