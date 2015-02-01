angular.module('idea-hat.account.controller',
  ['idea-hat.shared.f',
  'idea-hat.shared.user-factory',
  'ionic'])

.controller('AccountCtrl',
  ['$scope', '$state', '$f', 'User', '$firebaseAuth', '$ionicPopup', '$ionicModal',
  function($scope, $state, $f, User, $firebaseAuth, $ionicPopup, $ionicModal) {
  // initialize the $scope with the idea
  $scope.user = User($f.authID());
  $scope.auth = $firebaseAuth($f.ref());
  // list for changes in auth and update the user accordingly
  $scope.auth.$onAuth(function(authData) {
    $scope.user = User($f.authID());
  });

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
  $scope.showLoginModal = function() {
    $scope.modal.login.show();
  };
  $scope.hideLoginModal = function() {
    $scope.modal.login.hide();
  };
  $scope.showSignupModal = function() {
    $scope.modal.signup.show();
  };
  $scope.hideSignupModal = function() {
    $scope.modal.signup.hide();
  };
  $scope.doLogout = function() {
    $scope.auth.$unauth();
  }
  $scope.doLogin = function() {
    var user = {
      email: $scope.input.login.email,
      password: $scope.input.login.password
    }
    $scope.auth.$authWithPassword(user);
    $scope.hideLoginModal();
  }
  $scope.doSignup = function() {
    var user = {
      email: $scope.input.signup.email,
      password: $scope.input.signup.password
    }
    $scope.auth.$createUser(user);
    $scope.hideSignupModal();
  }

  //TODO: implement modal functionality
}]);
