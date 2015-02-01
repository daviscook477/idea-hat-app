angular.module('idea-hat.ideas.router', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider

  .state('app.ideas', {
    url: '/ideas',
    views: {
      'menuContent': {
        templateUrl: 'components/side-menu/ideas-view/ideas-view.html'
      }
    }
  })

}]);
