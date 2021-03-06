angular.module('idea-hat.category.controller',
  ['idea-hat.shared.f',
  'idea-hat.shared.category-factory',
  'ionic'])

.controller('CategoryCtrl', ['$scope', '$state', '$stateParams',
  '$f', 'Category', '$ionicModal', '$ionicPopup',
  function($scope, $state, $stateParams, $f, Category, $ionicModal, $ionicPopup) {
  // initialize the $scope with a category object
  $scope.category = Category($stateParams.id); // we need to trace the ideas but we don't want to trace the user
  $scope.category.$loaded().then(function(category) { //when the idea loads tell it to
    // load its ideas
    category.loadIdeas().then(function(ideaList) {
      ideaList.on("idea", function(idea) { // set a callback for each idea
        idea.loadUser(); // make each idea load its user
      });
    });
    // load its users
    category.loadUser();
  });

  // intialize the input containers to empty
  $scope.resetInput = function() {
    $scope.input = {
      title: null,
      description: null
    };
  };
  $scope.resetInput();

  // create the modal for posting ideas
  $ionicModal.fromTemplateUrl('components/side-menu/shared/idea-post-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // functions for manipulating the modal
  $scope.hideIdeaModal = function() {
    $scope.modal.hide();
  };
  $scope.showIdeaModal = function() {
    $scope.modal.show();
  };
  $scope.postIdea = function() {
    // validate the input
    var validInput = true;
    var inputError = null;
    if ($scope.input.title === null || $scope.input.title === "") {
      validInput = false;
      // set input error
    } else if ($scope.input.description === null || $scope.input.description === "") {
      validInput = false;
      // set input error
    }
    if (validInput) {
      // post the idea to the firebase
      var idea = {
        title: $scope.input.title,
        description: $scope.input.description,
        owner: $f.authID()
      };
      $scope.category.postIdea(idea); // post the idea to the firebase
      $scope.hideIdeaModal(); // hide the modal-it's purpose is done
      $scope.resetInput();
    } else {
      // popup with error
      $ionicPopup.alert({title: inputError});
    }
  };

  $scope.goIdea = function(idea) {
    $state.go('app.idea', {id: idea.$id});
  };
}]);
