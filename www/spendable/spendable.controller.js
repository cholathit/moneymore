angular.module('App')
  .controller('SpendableCtrl', function($state,$scope, $http,Auth,Users,Transaction) {

    var spendableCtrl = this;

    //spendableCtrl.profile = profile;
    spendableCtrl.user        = Users;
    spendableCtrl.dashboard_view      = '/templates/dashboard.template.html';



    spendableCtrl.addTransaction = function(){
      var data =[
                spendableCtrl.spendableAmount,
                spendableCtrl.spendableCategories,
                spendableCtrl.spendableWhereto,
                spendableCtrl.spendableNote,
                spendableCtrl.spendableDate
                ];
      console.log(data);
      console.log("test Spendable");
    }
    spendableCtrl.test = function(){
      console.log("test click");
    }

  })


