angular.module('idea-hat.idea.router', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider

  .state('app.idea', {
    url: '/idea:id',
    views: {
      'menuContent': {
        templateUrl: 'components/side-menu/idea-view/idea-view.html'
      }
    }
  })

}]);
