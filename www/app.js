angular.module('idea-hat',
  ['ionic',
  'idea-hat.controller',
  'idea-hat.ideas',
  'idea-hat.category',
  'idea-hat.categories',
  'idea-hat.idea',
  'idea-hat.account',
  'idea-hat.profile',
  'idea-hat.shared.f'])

.run(['$ionicPlatform', '$f', '$window', function($ionicPlatform, $f, $window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  // load settings from the window - this is for auto login
  var rememberLogin = $window.localStorage['rememberLogin'];
  if (rememberLogin === "true") {
    rememberLogin = true;
  }
  if (rememberLogin === "false") {
    rememberLogin = false;
  }
  if (rememberLogin) { // here we auto login the user or  invalidate their login if they don't want rememberd
     var user = JSON.parse($window.localStorage['login']); // get the user
     try {
       $f.$login(user); // do the auto login
     } catch(err) {}
  } else {
    $f.ref().unauth(); // they don't want to auto-login - make sure they are logged out
  }
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "app.html",
    controller: 'AppCtrl'
  })

  $urlRouterProvider.otherwise('/app/categories');
});
