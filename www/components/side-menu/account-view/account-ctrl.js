angular.module('idea-hat.account.controller',
  ['idea-hat.shared.f',
  'idea-hat.shared.user-factory',
  'ionic'])

.controller('AccountCtrl',
  ['$scope', '$state', '$f', 'User', '$firebaseAuth', '$ionicPopup', '$ionicModal', '$window',
  function($scope, $state, $f, User, $firebaseAuth, $ionicPopup, $ionicModal, $window) {
  // initialize the $scope with the idea
  if ($f.authID() == null) {
    $scope.user = null;
  } else {
    $scope.user = User($f.authID());
  }
  $scope.auth = $firebaseAuth($f.ref());
  // list for changes in auth and update the user accordingly
  $scope.auth.$onAuth(function(authData) {
    if ($f.authID() == null) {
      $scope.user = null;
    } else {
      $scope.user = User($f.authID());
    }
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
      },
      edit: {
        text: null
      }
    };
  };
  $scope.resetInput();
  $scope.modal = {
    login: null,
    signup: null,
    edit: null
  };

  $scope.defaults = {
    login: {
      email: "Email",
      password: "Password"
    },
    signup: {
      email: "Email",
      password: "Password"
    },
    edit: {
      text: null
    }
  };
  $scope.props = {
    screenName: {
      placeholder: "Screen Name",
      name: "screenName"
    }
  };

  // load settings from the window
  var rememberLogin = $window.localStorage['rememberLogin'];
  if (rememberLogin === "true") {
    rememberLogin = true;
  }
  if (rememberLogin === "false") {
    rememberLogin = false;
  }
  $scope.input.rememberLogin = rememberLogin;

  // watch for changes in remember login
  $scope.$watch('input.rememberLogin', function(value) {
    rememberLogin = value;
    console.log("check button changed");
    console.log("remember login: " + rememberLogin);
    $window.localStorage['rememberLogin'] = value;
  });

  $scope.edit = function(prop) {
    $scope.defaults.edit.text = $scope.props[prop].placeholder;
    $scope.current = $scope.props[prop].name;
    $scope.showEditModal();
  };
  $scope.showEditModal = function() {
    $scope.modal.edit.show();
  };
  $scope.hideEditModal = function() {
    $scope.modal.edit.hide();
  };
  $scope.finishEdit = function() {
    if ($scope.current === "screenName") {
      $scope.user.screenName = $scope.input.edit.text;
      $scope.user.$save();
      $scope.resetInput();
    }
    $scope.hideEditModal();
  }

  // create the modal for edits
  $ionicModal.fromTemplateUrl('components/side-menu/shared/text-edit-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modal.edit = modal;
  });
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
    $window.localStorage['login'] = null;
  };
  $scope.doLogin = function() {
    var user = {
      email: $scope.input.login.email,
      password: $scope.input.login.password
    };
    $scope.auth.$authWithPassword(user).then(function(authData) {
      $window.localStorage['login'] = JSON.stringify(user);
      console.log("stored login info: " + JSON.stringify(user));
    });
    $scope.hideLoginModal();
  };
  $scope.doSignup = function() {
    var user = {
      email: $scope.input.signup.email,
      password: $scope.input.signup.password
    }
    $scope.auth.$createUser(user);
    $scope.hideSignupModal();
  };

  //TODO: implement modal functionality
}]);
