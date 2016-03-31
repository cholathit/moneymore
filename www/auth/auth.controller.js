angular.module('App')
  .controller('AuthCtrl', function(Auth, $state, MoneyQuote,Users,md5){

    var authCtrl = this;
    authCtrl.users  = Users;
    authCtrl.auth   = Auth;

    authCtrl.moneyquote = MoneyQuote;

    authCtrl.user = {
      email: '',
      password: '',
      firstname:'',
      lastname:'',
      b_day:'',
      b_month:'',
      b_year:''
    }

    authCtrl.days     = [1,	2,	3,	4,	5,	6,	7,	8,	9,	10,	11,	12,	13,	14,	15,	16,	17,	18,	19,	20,	21,	22,	23,	24,	25,	26,	27,	28,	29,	30,	31];
    authCtrl.months   = [
                        {id: 1, month: "Jan"}, {id: 2,month: 'Feb'},{id: 3,month: 'Mar'},{id: 4,month: 'Apr'},{id: 5,month: 'May'}, {id: 6,month: 'Jun'},{id: 7,month: 'Jul'},{id: 8,month: 'Aug'},
                        {id: 9,month: 'Sept'},{id: 10,month: 'Oct'},{id: 11,month: 'Nov'},{id: 12,month: 'Dec'}
                        ];

    var year = new Date().getFullYear();
    var range = [];
    range.push(year);
    for(var i=1;i<100;i++) {
      range.push(year - i);
    }
    authCtrl.years = range;

    //Random Money Quote
    authCtrl.moneyquote.all.$loaded().then(function(val){
      var randQuote = Math.floor((Math.random() * authCtrl.moneyquote.all.length ) + 1);
      if (authCtrl.moneyquote.$id = randQuote){
        authCtrl.randQuote = authCtrl.moneyquote.quote(randQuote);
      }
    });




    //Register with facebook
    authCtrl.registerFB = function(){
      authCtrl.auth.ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          authCtrl.users.userRef.child('facebook:'+authData.facebook.id).set({
            firstname:        authData.facebook.cachedUserProfile.first_name,
            lastname:         authData.facebook.cachedUserProfile.last_name,
            profile_image:    authData.facebook.profileImageURL,
            gender:           authData.facebook.cachedUserProfile.gender,
            date_of_birth:    authData.facebook.cachedUserProfile.birthday,
            locale:           authData.facebook.cachedUserProfile.locale,
            fb_locationID:    authData.facebook.cachedUserProfile.location.id,
            fb_location_name: authData.facebook.cachedUserProfile.location.name,
            date_of_birth:    authData.facebook.cachedUserProfile.birthday,
            emailHash:        md5.createHash(authData.facebook.cachedUserProfile.email),
            join:             moment().format('YYYY-MM-DD H:m:s')
          });
          $state.go('app.home');
        }
      }, {
        scope: "email,user_likes" // the permissions requested
      });

    }


    authCtrl.login = function (){
      Auth.auth.$authWithPassword(authCtrl.user).then(function (auth){
        $state.go('app.home');
      }, function (error){
        authCtrl.error = error;
      });
    };;


    //Register User
    authCtrl.register = function (){

      Auth.auth.$createUser(authCtrl.user).then(function (user){

        authCtrl.users.userRef.child(user.uid).set({
            firstname:      authCtrl.user.firstname,
            lastname:       authCtrl.user.lastname,
            gender:         authCtrl.user.gender,
            date_of_birth:  authCtrl.user.b_day+'-'+authCtrl.user.b_month+'-'+authCtrl.user.b_year,
            emailHash: md5.createHash(authCtrl.user.email),
            join:           moment().format('YYYY-MM-DD H:m:s')
        });

        authCtrl.users.userRef.child(user.uid+'userPlan').set({
            income:         null,
            saving:         null,
            bill:           null,
            goal:           null,
            mthSpendable:   null,
            dailySpendable: null,
        });

        authCtrl.login();

      }, function (error){
        authCtrl.error = error;
      });
    };

  });
