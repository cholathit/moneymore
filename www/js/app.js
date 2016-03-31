angular.module('App', ['ionic', 'App.controllers',
    'firebase',
    'angular-md5',
    'ui.router',
    'chart.js',
    'ngMaterial',
    'ngMdIcons',
    'pascalprecht.translate',
    'flow',
    'angular-toArrayFilter'
    ])

  /*
   * Material Theme
   */
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('cyan')
      .accentPalette('blue-grey');

  })

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('app.home', {
        url: '/',
        views: {
          'menuContent': {
            templateUrl: 'home/home.html',
          }
        },
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.auth.$requireAuth().then(function(auth){
              $state.go('app.dashboard');
            }, function(error){
              return;
            });
          }
        }
      })

    .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            controller: 'AuthCtrl as authCtrl',
            templateUrl: 'auth/login.html',
          }
        },
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.auth.$requireAuth().then(function(auth){
              $state.go('app.home');
            }, function(error){
              return;
            });
          }
        }
      })

    .state('app.logout', {
      url: '/logout',
      views: {
        'menuContent': {
          templateUrl: 'home/home.html',
        }
      },
      resolve: {
        auth: function ($state, Users, Auth) {
          return Auth.auth.$unauth().catch(function () {
            $state.go('app.home');
          }, function (error) {
            $state.go('app.home');
            return;
          });
        }
      }
    })

    .state('app.register', {
      url: '/register',
      views: {
        'menuContent': {
          controller: 'AuthCtrl as authCtrl',
          templateUrl: 'auth/register.html',
        }
      },
      resolve: {
        requireNoAuth: function($state, Auth){
          return Auth.auth.$requireAuth().then(function(auth){
            $state.go('app.home');
          }, function(error){
            return;
          });
        }
      }
    })

      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          'menuContent': {
              controller: 'DashboardCtrl as dashboardCtrl',
              templateUrl: 'dashboard/index.html',
          }
        },
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.auth.$requireAuth().catch(function(){
              $state.go('app.home');
            });
          },
          profile: function(Users, Auth,$state){
            return Auth.auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded().then(function (profile) {
                if (profile.userPlan.complete_setup == true) {
                  return profile;
                } else {
                  Users.userRef.child(auth.uid+'userPlan').set({
                    income:         0,
                    saving:         0,
                    bill:           0,
                    goal:           0,
                    mthSpendable:   0,
                    dailySpendable: 0,
                    complete_setup: false
                  });
                  $state.go('app.start');
                }
              });
            });
          }
        }
      })


    .state('app.start', {
      url: '/start',
      views: {
        'menuContent': {
          controller: 'DashboardCtrl as dashboardCtrl',
          templateUrl: 'setting/setting.html',
        }
      },
      resolve:{
        profile: function(Users, Auth,$state) {
          return Auth.auth.$requireAuth().then(function (auth) {
            return Users.getProfile(auth.uid).$loaded().then(function (profile) {
              if (profile.userPlan.complete_setup == true) {
                $state.go('app.dashboard');
              }
              else{
                Users.userRef.child(auth.uid+'/userPlan').set({
                  income:         0,
                  saving:         0,
                  bill:           0,
                  goal:           0,
                  mthSpendable:   0,
                  dailySpendable: 0,
                  complete_setup: false
                });
                return profile;
              }
            });
          });
        }
      }
    })


    .state('app.spendable', {
      url: '/spendable',
      views: {
        'menuContent': {
          controller: 'DashboardCtrl as dashboardCtrl',
          templateUrl: 'spendable/index.html',
        }
      },
      resolve:{
        profile: function(Users, Auth){
          return Auth.auth.$requireAuth().then(function(auth){
            return Users.getProfile(auth.uid).$loaded();
          });
        }
      }
    })


    .state('app.spending', {
      url: '/spending',
      views: {
        'menuContent': {
          controller: 'DashboardCtrl as dashboardCtrl',
          templateUrl: 'spending/index.html',
        }
      },
      resolve:{
        profile: function(Users, Auth){
          return Auth.auth.$requireAuth().then(function(auth){
            return Users.getProfile(auth.uid).$loaded();
          });
        }
      }
    })

    .state('app.bill', {
      url: '/bill',
      views: {
        'menuContent': {
          controller: 'DashboardCtrl as dashboardCtrl',
          templateUrl: 'bill/index.html',
        }
      },
      resolve:{
        profile: function(Users, Auth){
          return Auth.auth.$requireAuth().then(function(auth){
            return Users.getProfile(auth.uid).$loaded();
          });
        }
      }
    })


    .state('app.goal', {
      url: '/goal',
      views: {
        'menuContent': {
          controller: 'DashboardCtrl as dashboardCtrl',
          templateUrl: 'goal/index.html',
        }
      },
      resolve:{
        profile: function(Users, Auth){
          return Auth.auth.$requireAuth().then(function(auth){
            return Users.getProfile(auth.uid).$loaded();
          });
        }
      }
    })


    .state('app.goalEdit',{
      url: '/goal/:goalID/:goalLocation',

      views:{

        '':{
          templateUrl: 'goal/edit.html',
          controller: 'DashboardCtrl as dashboardCtrl',
        },
        'body@goalEdit':{
          templateUrl: 'goal/edit_view.html',
          controller: 'GoalEdit as goalEdit',
          resolve:{
            edit: function(Goal, Auth,$stateParams){
              return Auth.auth.$requireAuth().then(function(auth) {
                return Goal.getDetail(auth.uid,$stateParams.goalID).$loaded();
              });
            }
          }
        }
      },

      resolve:{
        profile: function(Goal, Auth,Users){
          return Auth.auth.$requireAuth().then(function(auth) {
            return Users.getProfile(auth.uid).$loaded();
          });
        },

      }
    })


    .state('app.creditcard', {
      url: '/creditcard',
      views: {
        'menuContent': {
          controller: 'DashboardCtrl as dashboardCtrl',
          templateUrl: 'creditcard/add.html',
        }
      },
      resolve:{
        profile: function(Users, Auth){
          return Auth.auth.$requireAuth().then(function(auth){
            return Users.getProfile(auth.uid).$loaded();
          });
        }
      }
    })

    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          controller: 'DashboardCtrl as dashboardCtrl',
          templateUrl: 'users/profile.html',
        }
      },
      resolve: {
        auth: function($state, Users, Auth){
          return Auth.auth.$requireAuth().catch(function(){
            $state.go('app.home');
          });
        },
        profile: function(Users, Auth){
          return Auth.auth.$requireAuth().then(function(auth){
            return Users.getProfile(auth.uid).$loaded();
          });
        }
      }
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');

})

  .filter('orderObjectBy', function () {
    return function (items, field, reverse) {
      var filtered = []
      angular.forEach(items, function (item) {
        filtered.push(item)
      })
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1)
      })
      if (reverse) filtered.reverse()
      return filtered
    }
  })

  //.filter('orderObjectBy', function(){
  //  return function(input, attribute) {
  //    if (!angular.isObject(input)) return input;
  //    var array = [];
  //    for(var objectKey in input) {
  //      array.push(input[objectKey]);
  //    }
  //    array.sort(function(a, b){
  //      a = parseInt(a[attribute]);
  //      b = parseInt(b[attribute]);
  //      return a - b;
  //    });
  //    return array;
  //  }
  //})

  .constant('FirebaseUrl', 'https://mmxyz.firebaseio.com/');
