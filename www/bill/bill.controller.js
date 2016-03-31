angular.module('App')
  .controller('BillCtrl', function($state,$rootScope, $q, md5, Users,Categories,Bill) {

    var billCtrl = this;

    billCtrl.categories = Categories;
    billCtrl.bill       = Bill;
    billCtrl.user       = Users;
    billCtrl.profile    = $rootScope.profile;

    billCtrl.bills      = billCtrl.user.userBill(billCtrl.profile.$id);

    billCtrl.thisMonth  = moment().format('YYYY-MM');
    //If the values are not quire put them here, so that we can add them to FB eventhough it's empty
    billCtrl.billNote ='';
    //--- end above ---


    //Bill Date Range
    billCtrl.billDueRange = function(){
      var range = [];
      for(var i=1;i<=31;i++) {
        range.push(i);
      }
      return range;
    }


    //Create Bill
    billCtrl.createBill = function(){

      billCtrl.user.userBill(billCtrl.profile.$id).$add({
        name:     billCtrl.billName,
        amount:   billCtrl.billAmount,
        category: billCtrl.billCategories.Name,
        note:     billCtrl.billNote,
        flg:      1,
        paid:     0,
        due_on:   billCtrl.billDue,
        created:  moment().format('YYYY-MM-DD H:m:s')
      });
    };


    billCtrl.checkPaid = function($id){
      return billCtrl.bill.checkBillPaid(billCtrl.profile.$id,$id);
    }

    //Remove Bill
    billCtrl.removeBill = function($id){
      billCtrl.bill.getBill(billCtrl.profile.$id,$id).update({flg:0});
    }

    //Mark as paid
    billCtrl.markPaid = function($id){
      var obj = billCtrl.bill.billTracker(billCtrl.profile.$id,$id);
      obj.$add(
        {
          bill_id:$id,
          created:moment().format('YYYY-MM-DD')
        }
      ).then(function(ref) {
        billCtrl.bill.getBill(billCtrl.profile.$id,$id).update(
          {
            last_paid:moment().format('YYYY-MM'),
            updated:  moment().format('YYYY-MM-DD')
          }
        );
        var id = ref.key();
        console.log("added record with id " + id);
        obj.$indexFor(id); // returns location in the array
      });
    }


    //Due in
    billCtrl.dueIn = function($date){
      var date = moment().format('YYYY-MM'+$date);

      var start = moment(date);
      var end   = moment();
      end.to(start);       // "5 days ago"
      end.to(start, true); // "5 days"

      return end.to(start);
    }



  });
