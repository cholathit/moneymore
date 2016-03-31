angular.module('App')
  .factory('Bill', function($firebaseArray, $firebaseObject, FirebaseUrl){

    var ref = new Firebase(FirebaseUrl+'users');
    var arr = $firebaseArray(ref);

    //Bill Tracker
    var Bill = {

      billTracker: function(uid,$id){
        return $firebaseArray(ref.child(uid).child('bill_tracker').child(moment().format('YYYYMM')));
      },

      refBillTracker: function(uid,$id){
        return $firebaseArray(ref.child(uid).child('bill_tracker').child(moment().format('YYYYMM')));
      },

      history:function(uid){
        return $firebaseArray(ref.child(uid).child('bill_tracker'));
      },

      checkBillPaid:function(uid,$id){
        return $firebaseArray(ref.child(uid).child('bill_tracker').child(moment().format('YYYYMM'))
                              .orderByChild('bill_id')
                              .equalTo($id));
      },

      getTracker:function(uid){
        //var userGoal = usersRef.child(uid).child("Goal").orderByChild("flg").equalTo(1);
        return ref.child(uid).child('bill_tracker');
      },
      getBill:function(uid,$id){
        return ref.child(uid).child('bill').child($id);
      },
      userBill:function(uid){
        return $firebaseObject(ref.child(uid));
      },

      all: arr

    };

    return Bill;
  });
