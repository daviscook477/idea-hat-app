angular.module('idea-hat.categories.controller',
  ['idea-hat.shared.f',
  'idea-hat.shared.category-factory'])

.controller('CategoriesCtrl', ['$scope', '$state', '$f', 'Category', '$ionicModal', '$ionicPopup',
  function($scope, $state, $f, Category, $ionicModal, $ionicPopup) {
  // initialize the $scope with an ideas object
  $scope.categories = {};

  // intialize the input containers to empty
  $scope.resetInput = function() {
    $scope.input = {
      title: null
    };
  };
  $scope.resetInput();

  // callback for when the ideas are updated
  var categoriesCB = function(snapshot) {
    var data = snapshot.val();
    for (param in data) { // find each category, param is the key for that category
      // each category object we create DOESN'T need to find the data at each of its ideas
      $scope.categories[param] = Category(param, false, false); // at each key in $scope.categories put an category created from that key
    }
  };

  // listen for changes in the ideas
  $f.ref().child("categories").on("value", categoriesCB);

  // create the modal for posting ideas
  $ionicModal.fromTemplateUrl('components/side-menu/shared/category-post-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // functions for manipulating the modal
  $scope.hideCategoryModal = function() {
    $scope.modal.hide();
  };
  $scope.showCategoryModal = function() {
    $scope.modal.show();
  };
  $scope.postCategory = function() {
    // validate the input
    var validInput = true;
    var inputError = null;
    if ($scope.input.title === null || $scope.input.title === "") {
      validInput = false;
      // set input error
    }
    if (validInput) {
      // post the idea to the firebase
      var category = {
        title: $scope.input.title,
        owner: $f.authID()
      };
      $f.ref().child("categories").push(category); // push the category to the firebase
      $scope.hideCategoryModal(); // hide the modal-it's purpose is done
      $scope.resetInput();
    } else {
      // popup with error
      $ionicPopup.alert({title: inputError});
    }
  };

  $scope.goCategory = function(category) {
    $state.go('app.category', {id: category.$id});
  };
}]);
