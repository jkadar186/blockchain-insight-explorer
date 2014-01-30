'use strict';

angular.module('insight.connection').controller('ConnectionController',
function($scope, $window, Status, Sync, getSocket) {

  // Set initial values
  $scope.serverOnline = true;
  $scope.clienteOnline = true;

  var socket = getSocket($scope);

  // Check for the node server connection
  socket.on('disconnect', function() {
    $scope.serverOnline = false;
  });

  socket.on('connect', function() {
    $scope.serverOnline = true;
  });

  // Check for the  api connection
  $scope.getConnStatus = function() {
    Sync.get({},
    function(sync) {
      $scope.apiOnline = (sync.status !== 'aborted' && sync.status !== 'error') ? true : false;
    },
    function() {
      $scope.apiOnline = false;
    });
  };

  socket.emit('subscribe', 'sync');
  socket.on('status', function(sync) {
      $scope.apiOnline = (sync.status !== 'aborted' && sync.status !== 'error') ? true : false;
  });

  // Check for the client conneciton
  $window.addEventListener('offline', function() {
    $scope.$apply(function() {
      $scope.clienteOnline = false;
    });
  }, true);

  $window.addEventListener('online', function () {
    $scope.$apply(function() {
      $scope.clienteOnline = true;
    });
  }, true);

});
