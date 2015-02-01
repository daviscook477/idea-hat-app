angular.module('idea-hat.account.controller',
  ['idea-hat.shared.f',
  'idea-hat.shared.user-factory',
  'ionic'])

.controller('AccountCtrl',
  ['$scope', '$state', '$f', 'User', '$ionicPopup', '$ionicModal',
  function($scope, $state, $f, User, $ionicPopup, $ionicModal) {
  // initialize the $scope with the idea
  $scope.user = User($f.authID());

  // intialize the input containers to empty
  $scope.resetInput = function() {
    $scope.input = {
      login: {
        email: null,
        password: null
      },
      signup: {
        email: null,
        password: null
      }
    };
  };
  $scope.resetInput();
  $scope.modal = {
    login: null,
    signup: null
  };

  // create the modal for login
  $ionicModal.fromTemplateUrl('components/side-menu/shared/login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modal.login = modal;
  });
  // create the modal for signup
  $ionicModal.fromTemplateUrl('components/side-menu/shared/signup-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modal.signup = modal;
  });
}]);
