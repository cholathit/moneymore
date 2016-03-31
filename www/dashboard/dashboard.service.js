angular.module('App')
.factory('Dashboard', function($firebaseAuth, FirebaseUrl){

    var ref = new Firebase(FirebaseUrl);
    var dashboard = $firebaseAuth(ref);


    return dashboard;
  });
