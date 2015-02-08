angular.module('idea-hat.profile.router', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider

  .state('app.profile', {
    url: '/profile:id',
    views: {
      'menuContent': {
        templateUrl: 'components/side-menu/profile-view/profile-view.html'
      }
    }
  })

}]);
