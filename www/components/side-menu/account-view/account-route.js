angular.module('idea-hat.account.router', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider

  .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'components/side-menu/account-view/account-view.html'
      }
    }
  })

}]);
