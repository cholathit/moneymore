angular.module('App')
  .factory('Creditcard', function($firebaseArray, $firebaseObject, FirebaseUrl){

    var userRef = new Firebase(FirebaseUrl+'users');
    //Issuer
    var ref_issuer  = new Firebase(FirebaseUrl+'creditcard_issuer');
    var arr_issuer  = $firebaseArray(ref_issuer);

    //Types
    var ref_types  = new Firebase(FirebaseUrl+'creditcard_types');
    var arr_types  = $firebaseArray(ref_types);

    //Cards
    var ref         = new Firebase(FirebaseUrl+'creditcards');
    var arr         = $firebaseArray(ref);


    var Creditcard = {
      userCard:function(uid){
        return $firebaseObject(ref.child(uid));
      },

      getCard:function(uid,$id){
        return userRef.child(uid).child('creditcard').child($id);
      },

      all:    arr,
      issuer: arr_issuer,
      types:   arr_types

    };

    return Creditcard;
  });
