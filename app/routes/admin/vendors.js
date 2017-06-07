import Ember from 'ember';

export default Ember.Route.extend({
  firebaseApp: Ember.inject.service(),
  storageRef: '',
  beforeModel: function() {
    var sesh = this.get("session").fetch().catch(function() {});
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
    }
    return sesh;
  },
  hashCode: function(str) { //String to hash function
    let hash = 0,
      i, chr, len;
    if (str.length === 0) {
      return hash;
    }
    for (i = 0, len = str.length; i < len; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },
  deleteImages: function(id, vendorId) {
    return new Promise(function(resolve, reject) {
      function isComplete() {
        if (totalProcesses <= completedProcesses) {
          resolve();
        }
      }
      var totalProcesses = 6;
      var completedProcesses = 0;
      var storageRef = this.get('firebaseApp').storage().ref();
      var _ref = 'vendorImages/' + vendorId + '/services/' + id;
      var mainRef = storageRef.child(_ref + '/mainImg');
      this.store.findRecord('catItem', id).then((catItem) => {

        // Delete the file
        if (catItem.get('imageURL')) {
          mainRef.delete().then(function() { // File deleted successfully
            completedProcesses++;
            isComplete();
          }).catch(function(error) { // Uh-oh, an error occurred!
            console.log(error);
          });
        } else {
          completedProcesses++;
          isComplete();
        }

        if (catItem.get('image0')) {
          var ref0 = storageRef.child(_ref + '/image0');
          ref0.delete().then(function() { // File deleted successfully
            completedProcesses++;
            isComplete();
          }).catch(function(error) { // Uh-oh, an error occurred!
            console.log(error);
          });
        } else {
          completedProcesses++;
          isComplete();
        }

        if (catItem.get('image1')) {
          var ref1 = storageRef.child(_ref + '/image1');
          ref1.delete().then(function() { // File deleted successfully
            completedProcesses++;
            isComplete();
          }).catch(function(error) { // Uh-oh, an error occurred!
            console.log(error);
          });
        } else {
          completedProcesses++;
          isComplete();
        }

        if (catItem.get('image2')) {
          var ref2 = storageRef.child(_ref + '/image2');
          ref2.delete().then(function() { // File deleted successfully
            completedProcesses++;
            isComplete();
          }).catch(function(error) { // Uh-oh, an error occurred!
            console.log(error);
          });
        } else {
          completedProcesses++;
          isComplete();
        }

        if (catItem.get('image3')) {
          var ref3 = storageRef.child(_ref + '/image2');
          ref3.delete().then(function() { // File deleted successfully
            completedProcesses++;
            isComplete();
          }).catch(function(error) { // Uh-oh, an error occurred!
            console.log(error);
          });
        } else {
          completedProcesses++;
          isComplete();
        }

        if (catItem.get('image4')) {
          var ref4 = storageRef.child(_ref + '/image2');
          ref4.delete().then(function() { // File deleted successfully
            completedProcesses++;
            isComplete();
          }).catch(function(error) { // Uh-oh, an error occurred!
            console.log(error);
          });
        } else {
          completedProcesses++;
          isComplete();
        }

      });
    });
  },
  deleteBranding: function(vendorId) {
    return new Promise(function(resolve, reject) {
      function isCompleted() {
        if (bgDeleted === true && biDeleted === true) {
          resolve();
        }
      }
      var storageRef = this.get('firebaseApp').storage().ref();
      var _ref = 'vendorImages/' + vendorId + '/branding/';
      var ref1 = storageRef.child(_ref + "/backgroundImage");
      var bgDeleted = false;
      var biDeleted = false;

      this.store.findRecord('vendor', vendorId).then((vendor) => {
        if (vendor.get("backgroundImage")) {
          var ref1 = storageRef.child(_ref + "/backgroundImage");
          ref1.delete().then(function() { // File deleted successfully
            bgDeleted = true;
            isCompleted();
          }).catch(function(error) { // Uh-oh, an error occurred!
            console.log(error);
          });
        } else {
          bgDeleted = true;
          isCompleted();
        }

        if (vendor.get("brandImage")) {
          var ref2 = storageRef.child(_ref + "/brandImage");
          ref2.delete().then(function() { // File deleted successfully
            biDeleted = true;
            isCompleted();
          }).catch(function(error) { // Uh-oh, an error occurred!
            console.log(error);
          });
        } else {
          biDeleted = true;
          isCompleted();
        }

      });
    });


  },
  model() {

    return this.store.findAll('vendor');
    // return Ember.RSVP.hash({
    //        vendor: this.store.findAll('vendor'),
    //        vendorStat: this.store.findAll('vendor-stat')
    //    });
  },
  actions: {
    showLoggedInUsers: function(id) {
      let _this = this;
      let vendor = this.store.peekRecord('vendor', id);
      vendor.get('loggedInUsers').then((logged) => {
        logged.forEach(function(user) {
          _this.store.findRecord('user', user.id).then((usr) => {
            _this.controller.get('notifications').success("<a class='anchor-white' href='https://console.firebase.google.com/project/pear-server/database/data/users/" + user.id + "'>" + user.get('name') + " " + user.get('surname') + "</a>", {
              htmlContent: true
            });
          });
        });
      });
    },
    logIntoAccount: function(id) {
      let _this = this;
      let vendor = this.store.peekRecord('vendor', id);
      this.store.findRecord('user', this.get("currentUser.uid")).then((user)=>{
        user.get('vendorAccount').then((venAcc)=>{
          try{
            let _vendor = this.store.peekRecord('vendor', venAcc);
            let _loggedInUsers = _vendor.get('loggedInUsers');
            _loggedInUsers.removeObject(user);      
            _vendor.save();    
          } catch (ex) {}
          user.set('vendorAccount', vendor);
          let loggedInUsers = vendor.get('loggedInUsers');
          loggedInUsers.pushObject(user);
          vendor.save().then(()=>{
            user.save().then(()=> {
                this.transitionTo('index.vendor');
                this.controller.get('notifications').success('Logged in successfully!',{
                    autoClear: true
                });
            });
          });
        });

      });
    },

    destroyVendor: function(id) {
      let _this = this;
      let vendor = this.store.peekRecord('vendor', id);

      function logOutUsers() {
        return new Promise(function(resolve, reject) {
          let totalLogged = 0;
          let processedCount = 0;

          function isComplete() {
            if (totalLogged <= processedCount) {
              console.log('users logged out');
              resolve();
            }
          }
          vendor.get('loggedInUsers').then((logged) => {
            totalLogged = logged.length;
            isComplete();
            logged.forEach(function(user) {
              _this.store.findRecord('user', user.id).then(() => {
                user.set('vendorAccount', null);
                user.save().then(() => {
                  processedCount++;
                  isComplete();
                });
              });
            });
          });

        });
      }


      function destroyLogin() {
        return new Promise(function(resolve, reject) {
          let hash = _this.hashCode(vendor.get('email')); //Hash the email address
          _this.store.findRecord('vendorLogin', hash).then((vendorLog) => { //Find the vendor account login
            vendorLog.destroyRecord().then(() => {
              console.log('login destroyed');
              resolve();
            });
          }, () => {
            console.log('login not found');
            resolve();
          });
        });
      }



      function destroyStats() {
        return new Promise(function(resolve, reject) {
          _this.store.findRecord('vendorStat', id).then((vendorStat) => {
            vendorStat.destroyRecord().then(() => {
              console.log('stats destroyed');
              resolve();
            });
          }, () => {
            console.log('stats not found');
            resolve();
          });
        });
      }



      function destroyAccount() {
        return new Promise(function(resolve, reject) {
          vendor.destroyRecord().then(() => {
            console.log('destroying account');
            resolve();
          });
        });
      }


      function destroyListings() {
        return new Promise(function(resolve, reject) {
          let totalListings = 0;
          let processedListings = 0;

          function isComplete() {
            if (totalListings <= processedListings) {
              resolve();
              console.log('images deleted');
            }
          }
          vendor.get('catItems').then((cats) => {
            totalListings = cats.length;
            isComplete();
            cats.forEach(function(cat) {
              _this.store.findRecord('catItem', cat.id).then((c) => {
                let catId = cat.id;
                _this.deleteImages(catId, id).then(() => {
                  c.destroyRecord.then(() => {
                    processedListings++;
                    isComplete();
                  });
                }, () => {
                  console.log('listing destroyed');
                  resolve();
                });
              });
            });
          });
        });
      }

      Promise.all([
        logOutUsers(),
        destroyLogin(),
        destroyStats(),
        destroyListings()
      ]).then(() => {
        destroyAccount().then(() => {
          _this.controller.get('notifications').success('Vendor has been removed successfully.', {
            autoClear: true
          });
        });
      });
      // _this.controller.get('notifications').success("<a class='anchor-white' href='https://console.firebase.google.com/project/pear-server/storage/files/vendorImages/"+id +"'>Delete Images Here</a>", {
      //   htmlContent: true
      // });

    }
  }
  // setupController: function (controller, model) {
  // this._super(controller, model);
  // Ember.set(controller, 'vendor', model.vendor);
  // Ember.set(controller, 'vendorStat', model.vendorStat);
  // }
});
