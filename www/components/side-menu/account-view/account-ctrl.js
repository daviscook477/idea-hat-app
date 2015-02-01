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
      text: null
    };
  };
  $scope.resetInput();

  // create the modal for posting ideas
  $ionicModal.fromTemplateUrl('components/side-menu/shared/comment-post-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // functions for manipulating the modal
  $scope.hideCommentModal = function() {
    $scope.modal.hide();
  };
  $scope.showCommentModal = function() {
    $scope.modal.show();
  };
  $scope.postComment = function() {
    // validate the input
    var validInput = true;
    var inputError = null;
    if ($scope.input.text === null || $scope.input.text === "") {
      validInput = false;
      // set input error
    }
    if (validInput) {
      // post the comment to the firebase
      var comment = {
        text: $scope.input.text,
        owner: $f.authID()
      };
      $scope.idea.postComment(comment); // post the comment to the firebase
      $scope.hideCommentModal(); // hide the modal-it's purpose is done
      $scope.resetInput();
    } else {
      // popup with error
      $ionicPopup.alert({title: inputError});
    }
  };
}]);
