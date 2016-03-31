angular.module('App')
  .controller('ProfileCtrl', function($scope,$state,$rootScope, $q, md5, Users,Currency){

    var profileCtrl = this;

    profileCtrl.profile   = $rootScope.profile;
    profileCtrl.user      = Users;
    profileCtrl.currency  = Currency;



    //Upload Profile Picture
    profileCtrl.processFiles = function(files) {
      angular.forEach(files, function (flowFile, i) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
          var uri = event.target.result;
          profileCtrl.user.ref(profileCtrl.profile.$id).update({
            profile_image: uri,
          })
        };
        fileReader.readAsDataURL(flowFile.file);
      });
    }

    //Init value
    profileCtrl.firstname   = profileCtrl.profile.firstname;
    profileCtrl.lastname    = profileCtrl.profile.lastname;

    //Userplan
    profileCtrl.income  = profileCtrl.profile.userPlan.income ;
    profileCtrl.saving  = profileCtrl.profile.userPlan.saving;
    profileCtrl.bill    = profileCtrl.profile.userPlan.bill;
    profileCtrl.doughLabels     = ["Income", "Saving","Bill"];


    //If data can be null
    profileCtrl.currencySelected = '';
    //end


    profileCtrl.spendable = function(){
      return profileCtrl.income - profileCtrl.saving - profileCtrl.bill;
    };


    /* Dough Setting*/
    profileCtrl.doughLabels = ["Income", "Saving", "Bills"];
    /* End Dough Setting */


    //Save job
    profileCtrl.saveJob = function(){
      profileCtrl.user.ref(profileCtrl.profile.$id).set({
        job:profileCtrl.jobSelected
      })
    };


    //Create User Plan
    profileCtrl.createUserplan = function(){
      profileCtrl.user.ref(profileCtrl.profile.$id).child("userPlan").set({
        income:   profileCtrl.income,
        saving:   profileCtrl.saving,
        bill:     profileCtrl.bill,
        mthSpendable:profileCtrl.spendable(),
        dailySpendable:profileCtrl.spendable()/30,
        complete_setup: true
      });
      profileCtrl.user.ref(profileCtrl.profile.$id).child("currency").set({
        currency: profileCtrl.currencySelected
      });
    };


    profileCtrl.updateChart = function(){
      profileCtrl.doughData   = [
        profileCtrl.income,
        profileCtrl.saving,
        profileCtrl.bill
      ]
    }

    profileCtrl.doughData   = [
      profileCtrl.income,
      profileCtrl.saving,
      profileCtrl.bill
    ];




    /*Update profile*/
    profileCtrl.updateProfile = function(){
      profileCtrl.profile.firstname = profileCtrl.firstname;
      profileCtrl.profile.lastname  = profileCtrl.lastname;
      profileCtrl.profile.$save();

    };



  });
