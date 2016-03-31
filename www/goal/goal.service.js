angular.module('App')
  .factory('Goal', function($firebaseArray, $firebaseObject, FirebaseUrl) {

    var ref = new Firebase(FirebaseUrl+'users');
    var arr = $firebaseArray(ref);

    var Goal = {

      getDetail:function(uid,goalId){
        return $firebaseObject(ref.child(uid).child('Goal/'+goalId));
      },
      ref:function(uid,goalId){
        return ref.child(uid).child('Goal/'+goalId);
      },

      all: arr

    }
    return Goal;

  });
