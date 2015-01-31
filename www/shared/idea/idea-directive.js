angular.module('idea-hat.shared.idea-directive', [])

.directive('ideaHatIdea', [function() {
  var link = function($scope, element, attrs) {
    // watch for when this directive is destroyed
    $scope.$on("destroy", function() {

    });
  };
  // return the directive
  return {
    link: link, // the link
    scope: {
      idea: '='
    }, // create a new isolate scope
    templateUrl: 'shared/idea/idea-directive.html' //this directive adds in this html in place of it
  };
}]);
