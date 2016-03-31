angular.module('App')


  .controller('GoalEdit', function($rootScope, $state,$scope, $http,Auth,edit,Goal) {

    var goalEdit = this;

    goalEdit.profile    = $rootScope.profile;
    goalEdit.goal       = Goal;
    goalEdit.goal_edit  = edit;

    //Init Vars
    goalEdit.dailySaving    = goalEdit.goal_edit.dailySaving;
    goalEdit.targetDate     = new Date(goalEdit.goal_edit.targetDate);
    goalEdit.duration_day   = goalEdit.goal_edit.duration_day;

    //Upload Picture
    goalEdit.processFiles = function(files,id) {
      angular.forEach(files, function (flowFile, i) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
          var uri = event.target.result;
          goalEdit.goal.ref(goalEdit.profile.$id,id).update({
            goal_image: uri,
          })
        };
        fileReader.readAsDataURL(flowFile.file);
      });
    }

    //Utils
    goalEdit.pax =[1,2,3,4,5,6,7,8,9,10];
    goalEdit.stay = function(){
      var range = [];
      for(var i=1;i<=31;i++) {
        range.push(i);
      }
      return range;
    }


    //Recalculating goal feasibility
    goalEdit.reCal = function(){

      if(!goalEdit.targetDate){
        var targetDate = goalEdit.goal_edit.targetDate;
        goalEdit.dailySaving  = goalEdit.amount/$rootScope.checkTargetDate(targetDate).diffDays;
        goalEdit.duration_day = $rootScope.checkTargetDate(targetDate).diffDays;

      }
      else{
        var targetDate = goalEdit.targetDate;
        goalEdit.selectedDate = targetDate;
        goalEdit.dailySaving = goalEdit.amount/$rootScope.checkTargetDate(targetDate).diffDays;
        goalEdit.duration_day = $rootScope.checkTargetDate(targetDate).diffDays;
      }
    }


    goalEdit.updateGoal = function(goal_id) {
      goalEdit.goal.ref($rootScope.profile.$id,goal_id).update({
        budget:       goalEdit.amount,
        persons:      goalEdit.persons,
         nights:       goalEdit.nights,
         dailySaving:  goalEdit.dailySaving,
         duration_day: goalEdit.duration_day,
         targetDate:   goalEdit.targetDate,
         updated:      moment().format('YYYY-MM-DD H:m:s')
      });
    }

  })



  .controller('GoalCtrl', function($rootScope, $state,$scope, $http,Auth,Creditcard,
                                        Users,Goal,
                                        $mdDialog) {

    var goalCtrl  = this;
    goalCtrl.user = Users;
    goalCtrl.goal = Goal;

    goalCtrl.profile = $rootScope.profile;

    //Services
    goalCtrl.userGoals = goalCtrl.user.userGoal(goalCtrl.profile.$id);
    //End services



    goalCtrl.goalContainer ='';

    /* Goals */
    goalCtrl.goals = [
      {title: 'Travel', content:'/goal/travel.html', icon:'fa fa-plane'},
      {title: 'Car',    content:'/goal/car.html', icon:'fa fa-car'},
      {title: 'Home',   content:'/goal/home.html', icon:'fa fa-home'}
    ];


    /*Travel variables*/
    goalCtrl.travel = {
      whereto: '',
      amount: '',
      travelDailySaving:0,
      travelSavingDays:'',
      travelSavingMonths:'',
      travelSpendableChange: '',
      goal_image:''
    };


    goalCtrl.pax =[1,2,3,4,5,6,7,8,9,10];
    goalCtrl.stay = function(){
      var range = [];
      for(var i=1;i<=31;i++) {
        range.push(i);
      }
      return range;
    }

    //Recalculate progress
    goalCtrl.recalProgress = function(data){
      var daySave = $rootScope.checkTargetDate(data.created).diffDays;
      goalCtrl.goal.ref($rootScope.profile.$id,data.$id).update({saving_ttl: data.dailySaving * daySave});
    }


    //Days until the target date
    goalCtrl.diffDays = function(data){
      return $rootScope.checkTargetDate(data).diffDays;
    }

    //Upload Picture
    goalCtrl.processFiles = function(files,id) {
      angular.forEach(files, function (flowFile, i) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
          var uri = event.target.result;
          goalCtrl.travel.goal_image = uri;
          /*goalCtrl.goal.ref(goalCtrl.profile.$id,id).update({
            goal_image: uri,
          })*/
        };
        fileReader.readAsDataURL(flowFile.file);
      });
    }


    /* Daily Saving Travel */
    goalCtrl.travel.dailySaving = function(date){
      var data = goalCtrl.checkTargetDate(date);
      goalCtrl.travel.goalDate           = data.targetDate;
      goalCtrl.travel.travelDailySaving  = goalCtrl.travel.amount/data.diffDays;
      goalCtrl.travel.travelMthlySaving  = isFinite(goalCtrl.travel.amount/data.diffMonths)?goalCtrl.travel.amount/data.diffMonths:0;
      goalCtrl.travel.travelSavingDays   = data.diffDays;
      goalCtrl.travel.travelSavingMonths = data.diffMonths;
      goalCtrl.travel.travelSpendableChange = goalCtrl.profile.userPlan.dailySpendable - goalCtrl.travel.travelDailySaving;
    };


    /*Check for days and months diff for target date*/
    $rootScope.checkTargetDate = function(date){

      var now         = moment();
      var target      = moment(date);

      var data = {
        diffDays: Math.abs(now.diff(target, 'Days')),
        diffMonths: Math.abs(now.diff(target, 'Months')),
        targetDate: moment(date,"MM-DD-YYYY")
      };
      return data;
    };

    //Update Goal
    goalCtrl.travel.updateGoal = function(id) {
      console.log(goalCtrl.profile.$id + id);

      goalCtrl.goal.ref($rootScope.profile.$id,id).update({
        budget:       goalCtrl.travel.amount,
        /*persons:      goalCtrl.travel.persons,
        nights:       goalCtrl.travel.nights,
        dailySaving:  goalCtrl.travel.travelDailySaving,
        duration_day: goalCtrl.travel.travelSavingDays,
        duration_mth: goalCtrl.travel.travelSavingMonths,
        saving_ttl:   goalCtrl.travel.travelDailySaving,
        saving_period:1,
        flg:          1,
        targetDate:   moment(goalCtrl.travel.targetDate).format('YYYY-MM-DD'),
        updated:      moment().format('YYYY-MM-DD H:m:s')*/
      });
    }


    /*Submit Travel Goal*/
    goalCtrl.travel.submitGoal = function(){
      console.log(goalCtrl.travel.goalDate);
      console.log(goalCtrl.travel.targetDate);

      goalCtrl.user.userGoal(goalCtrl.profile.$id).$add({
        type:         'travel',
        destination:  goalCtrl.travel.whereto,
        budget:       goalCtrl.travel.amount,
        dailySaving:  goalCtrl.travel.travelDailySaving,
        duration_day: goalCtrl.travel.travelSavingDays,
        duration_mth: goalCtrl.travel.travelSavingMonths,
        saving_ttl:   goalCtrl.travel.travelDailySaving,
        goal_image:   goalCtrl.travel.goal_image,
        saving_period:1,
        flg:          1,
        targetDate:   moment(goalCtrl.travel.targetDate).format('YYYY-MM-DD'),
        created:      moment().format('YYYY-MM-DD H:m:s')
      });

      goalCtrl.user.ref(goalCtrl.profile.$id).child("userPlan").set({
        income:         goalCtrl.profile.userPlan.income,
        saving:         goalCtrl.profile.userPlan.saving,
        bill:           goalCtrl.profile.userPlan.bill,
        goalSaving:     goalCtrl.profile.userPlan.goalSaving + goalCtrl.travel.travelMthlySaving,
        mthSpendable:   goalCtrl.user.spendable(goalCtrl.profile.$id) - goalCtrl.travel.travelMthlySaving,
        dailySpendable: goalCtrl.profile.userPlan.dailySpendable - goalCtrl.travel.travelDailySaving,
        updated:        Date.now()
      });


    }



  });
