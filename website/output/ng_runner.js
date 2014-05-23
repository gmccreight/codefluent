window.codeFluentApp = angular.module('CodeFluentApp', []);

window.codeFluentApp.controller("RunnerCtrl", function ($scope, $http) {

  $scope.error = "";
  $scope.files = undefined;
  $scope.currentFile = undefined;
  $scope.isRunning = false;
  $scope.currentTemplate = "kmp_in_python";
  $scope.runnerName = "";

  $scope.init = function() {
    $scope.templateSelected();
  };

  $scope.editableFiles = function() {
    var results = [];
    for (var i = 0; i < $scope.files.length; i++) { 
      var file = $scope.files[i];
      if (file.name == "Runner") {
        $scope.runnerName = file.value;
      }
      else {
        results.push(file);
      }
    }
    return results;
  };

  $scope.resetOutput = function() {
    $scope.error = "";
    $scope.setDidPass(false);
    $scope.setIsRunning(false);
  };

  $scope.templateSelected = function() {
    $scope.resetOutput();
    $scope.files = $scope.templateFor($scope.currentTemplate).files;
    $scope.currentFile = $scope.files[0].name;
  };

  $scope.hasError = function() {
    return $scope.error != "";
  };

  $scope.setError = function(message) {
    $scope.error = message;
  };

  $scope.showHowWasRun = function() {
    if ($scope.didPass) {
      return true;
    }
    return false;
  }

  $scope.howWasRunUrl = function() {
    return "https://github.com/gmccreight/codefluent/tree/master/runner/runner_containers/" + $scope.runnerName;
  }

  $scope.setDidPass = function(didPass) {
    $scope.didPass = didPass;
  };

  $scope.setIsRunning = function(isRunning) {
    $scope.isRunning = isRunning;
  };

  $scope.runCode = function() {
    $scope.resetOutput();
    $scope.setIsRunning(true);
    var successCallback = function(data, status, headers, config) {
      $scope.setIsRunning(false);
      if (data.error) {
        $scope.setError(data.error);
      }
      else {
        if (data.did_pass) {
          $scope.setDidPass(true);
        }
        else {
          $scope.setError(data.stdout + data.stderr);
        }
      }
    };
    var runnerUrl = $scope.getRunnerUrl();
    $http.post(runnerUrl, $scope.getDataToPost()).success(successCallback);
  };

  /* [tag:refactor:gem] it would be better if decisions based on where you are are centralized */
  $scope.getRunnerUrl = function() {
    if ( window.location.hostname.match(/codefluent/) ) {
      return 'http://runner.codefluent.us/';
    }
    else {
      return 'http://localhost:8080/';
    }
  };

  $scope.getDataToPost = function() {
    return {files: $scope.files};
  };

  $scope.codeTemplateNames = function() {
    return Object.keys(window.code_templates);
  }

  $scope.templateFor = function(name) {
    return window.code_templates[name];
  }
 
});
