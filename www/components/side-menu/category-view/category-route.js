angular.module('idea-hat.category.router', [])

.config(['$stateProvider', function($stateProvider) {
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
