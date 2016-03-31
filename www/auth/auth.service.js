angular.module('App')
  .factory('Auth', function($firebaseAuth, FirebaseUrl){
    var ref = new Firebase(FirebaseUrl);
    var auth = $firebaseAuth(ref);

    var Auth = {
      auth: $firebaseAuth(ref),
      ref:  ref
    };
    return Auth;
  });
