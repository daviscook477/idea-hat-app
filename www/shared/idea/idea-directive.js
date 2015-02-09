angular.module('idea-hat.shared.idea-directive', [])

.directive('ideaHatIdea', ['$state', function($state) {
  var link = function($scope, element, attrs) {
    $scope.goProfile = function() {
      console.log("going to profile");
      $state.go('app.profile', {id: $scope.idea.userD.$id});
    };
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
