angular.module('idea-hat.ideas.router', [])

.config(['$stateProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app.category', {
    url: '/category:id',
    views: {
      'menuContent': {
        templateUrl: 'components/side-menu/category-view/category-view.html'
      }
    }
  })

}]);
