/*
* Anything that we just READ put it here
* */

angular.module('App')


  .factory('Jobs', function($firebaseArray, $firebaseObject, FirebaseUrl) {
    var ref   = new Firebase(FirebaseUrl + 'jobs');
    var jobs  = $firebaseArray(ref);
    return jobs;
  })


  .factory('Currency', function($firebaseArray, $firebaseObject, FirebaseUrl) {

    var ref = new Firebase(FirebaseUrl + 'currency');
    var currency = $firebaseArray(ref);

    return currency;

  })


  .factory('Categories', function($firebaseArray, $firebaseObject, FirebaseUrl) {

    var ref = new Firebase(FirebaseUrl + 'categories');
    var categories = $firebaseArray(ref);

    return categories;

  })

.factory('Core_categories', function($firebaseArray, $firebaseObject, FirebaseUrl) {

    var ref = new Firebase(FirebaseUrl + 'core_categories');
    var core_categories = $firebaseArray(ref);

    return core_categories;

  })

  .factory('TransTypes', function($firebaseArray, $firebaseObject, FirebaseUrl) {

    var ref = new Firebase(FirebaseUrl + 'transTypes');
    var transTypes = $firebaseArray(ref);

    return transTypes;

  })

  .factory('PmtTypes', function($firebaseArray, $firebaseObject, FirebaseUrl) {

    var ref = new Firebase(FirebaseUrl + 'pmtTypes');
    var pmtTypes = $firebaseArray(ref);

    return pmtTypes;

  })


  .factory('MoneyQuote', function($firebaseArray, $firebaseObject, FirebaseUrl) {

    var ref = new Firebase(FirebaseUrl + 'moneyquote');
    var arr = $firebaseArray(ref);

    var MoneyQuote = {
        quote:function(id){
          return $firebaseObject(ref.child(id));
        },
        all: arr
      };
    return MoneyQuote;

  });
