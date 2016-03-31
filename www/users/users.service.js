angular.module('App')
  .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl){

    var usersRef = new Firebase(FirebaseUrl+'users');
    var users = $firebaseArray(usersRef);

    var Users = {

      //Get how much Spendable user have for the current day
      todaySpendable:function(uid){
        return $firebaseObject(usersRef.child(uid).child("spendable").child(moment().format('YYYY-MM-DD'))
                                );
      },

      spendable:function(uid){
        var spendable =  users.$getRecord(uid).userPlan.income -
                          (users.$getRecord(uid).userPlan.saving - users.$getRecord(uid).userPlan.bill);
        return spendable;
      },

      userBill:function(uid){
        return $firebaseArray(usersRef.child(uid).child("bill").orderByChild("flg").equalTo(1));
      },

      billTracker:function(uid){
        return $firebaseArray(usersRef.child(uid).child("bill_tracker"));
      },



      userPlan:function(uid){
        return $firebaseObject(usersRef.child(uid).child("userPlan").orderByChild("flg").equalTo(1));
      },

      userCard:function(uid){
        return $firebaseArray(usersRef.child(uid).child("creditcard").orderByChild("flg").equalTo(1));
      },

      userGoal:function(uid){
        var userGoal = usersRef.child(uid).child("Goal").orderByChild("flg").equalTo(1);
        return $firebaseArray(userGoal);
      },

      getProfile: function(uid){
          return $firebaseObject(usersRef.child(uid));
      },

      getArrProfile: function(uid){
        return $firebaseArray(usersRef.child(uid));
      },

      getDisplayName: function(uid){
        return users.$getRecord(uid).displayName;
      },

      ref:function(uid){
        return usersRef.child(uid);
      },
      objRef: $firebaseObject(usersRef),
      arrRef: $firebaseArray(usersRef),
      all: users,
      userRef: usersRef,

      getGravatar: function(uid){
        return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
      }
    };

    return Users;
  });
