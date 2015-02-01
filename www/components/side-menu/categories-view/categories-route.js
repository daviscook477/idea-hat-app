angular.module('idea-hat.categories.router', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider

  .state('app.categories', {
    url: '/categories',
    views: {
      'menuContent': {
        templateUrl: 'components/side-menu/categories-view/categories-view.html'
      }
    }
  })

}]);
