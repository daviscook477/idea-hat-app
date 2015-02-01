angular.module('idea-hat.shared.comment-directive', [])

.directive('ideaHatComment', [function() {
  var link = function($scope, element, attrs) {
    // watch for when this directive is destroyed
    $scope.$on("destroy", function() {

    });
  };
  // return the directive
  return {
    link: link, // the link
    scope: {
      comment: '='
    }, // create a new isolate scope
    templateUrl: 'shared/comment/comment-directive.html' //this directive adds in this html in place of it
  };
}]);
