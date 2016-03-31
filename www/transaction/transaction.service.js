angular.module('App')
.factory('Transaction', function($firebaseArray, $firebaseObject, FirebaseUrl,$firebaseAuth, Users,Auth){

  var usersRef = new Firebase(FirebaseUrl+'users');
  var ref = new Firebase(FirebaseUrl);

  var Transaction = {

    user: usersRef,

    userSpendableRef:function(uid){
      return usersRef.child(uid).child("spendable");
    },

    userTransaction:function(uid){
      return $firebaseArray(usersRef.child(uid).child("transactions"));
    },

    userTransactionRef:function(uid){
      return usersRef.child(uid).child("transactions");
    }

  };
  return Transaction;
});
