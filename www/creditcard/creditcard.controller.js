angular.module('App')
  .controller('CreditcardCtrl', function($rootScope, $state, $mdDialog, md5, Auth, Users,Creditcard) {

    var creditcardCtrl = this;

    creditcardCtrl.profile    = $rootScope.profile;
    creditcardCtrl.user       = Users;
    creditcardCtrl.creditcard = Creditcard;


    /* Credit cards */
    creditcardCtrl.cardIssuer  = creditcardCtrl.creditcard.issuer;
    creditcardCtrl.cardTypes   = creditcardCtrl.creditcard.types;
    creditcardCtrl.userCards   = creditcardCtrl.user.userCard(creditcardCtrl.profile.$id);

    // Initial card values
    creditcardCtrl.card = {
      issuer:     '',
      type:       '',
      card_limit: '',
      note:       '',
      created:    moment().format('YYYY-MM-DD')
    };

    creditcardCtrl.status = '  ';
    creditcardCtrl.showConfirm = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Remove Card?')
        .textContent('All of the banks have agreed to forgive you your debts.')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Please do it!')
        .cancel('Sounds like a scam');
      $mdDialog.show(confirm).then(function() {
        creditcardCtrl.status = 'You decided to get rid of your debt.';
      }, function() {
        creditcardCtrl.status = 'You decided to keep your debt.';
      });
    };


    //Credit card input
    creditcardCtrl.cardAdd = function(){
      creditcardCtrl.user.userCard(creditcardCtrl.profile.$id).$add(creditcardCtrl.card);
    };

    //Remove Credit card
    creditcardCtrl.removeBill = function($id){

      creditcardCtrl.creditcard.getCard(creditcardCtrl.profile.$id,$id).update({flg:0});
    }

  }); //end
