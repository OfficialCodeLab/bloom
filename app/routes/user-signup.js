import Ember from 'ember';

export default Ember.Route.extend({
  tempId: '',
  firebaseApp: Ember.inject.service(),
  beforeModel: function() {
    var sesh = this.get("session").fetch().catch(function() {});
    if (this.get('session.isAuthenticated')) {
      this.get('session').close().then(() => {
        this.controller.get('notifications').info('Logged out successfully.', {
          autoClear: true
        });
      });
    }
    return sesh;
  },
  actions: {
    nextSection() {
      this.controller.set('section1', false);

    },
    prevSection() {
      this.controller.set('section1', true);

    },
    logBtn() {
      this.controller.set('isLoggingIn', true);
      let email = this.controller.get('logInEmail');
      let password = this.controller.get('logInPassword');
      this.logIn(email, password);
    },
    signBtn() {
      // this.controller.get('notifications').warning('Sorry this is temporarily disabled for non-vendors!',{
      //     autoClear: true
      // });

      let firebase = this.get('firebaseApp');
      let _this = this;
      this.controller.set('isCreating', true);

      let name = this.controller.get('name');
      let surname = this.controller.get('surname');
      let email = this.controller.get('email');
      let isValidEmail = this.controller.get('isValidEmail');
      let password = this.controller.get('password');
      let passwordConfirm = this.controller.get('passwordConfirm');
      let passwordLength = this.controller.get('passwordLength');

      if (name) {
        if (surname) {
          if (passwordLength) {
            if (password === passwordConfirm) {
              if (isValidEmail) {
                firebase.auth().createUserWithEmailAndPassword(email, password).then((data) => {
                  // var user = firebase.auth().currentUser;
                  _this.logIn(email, password);
                  //_this.get('session').set('currentUser', data);
                  //...
                }).catch((error) => {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(error);
                  if (errorCode === 'auth/email-already-in-use') {
                    //Log in instead
                    _this.logIn(email, password);
                  } else {
                    _this.resetSignup();
                    _this.controller.get('notifications').error(errorMessage, {
                      autoClear: true
                    });
                  }
                  // ...
                });

              } else {
                //invalid email
                _this.controller.get('notifications').error("Please enter a valid email address", {
                  autoClear: true
                });
                _this.resetSignup();
              }
            } else {
              //passwords dont match
              _this.controller.get('notifications').error('Passwords do not match', {
                autoClear: true
              });
              _this.resetSignup();
            }
          } else {
            //pass too short
            _this.controller.get('notifications').error('Your password must be 8 characters or longer', {
              autoClear: true
            });
            _this.resetSignup();
          }
        } else {
          //no surname
          _this.controller.get('notifications').error('Please enter a surname', {
            autoClear: true
          });
          _this.resetSignup();
        }
      } else {
        //name not entered
        _this.controller.get('notifications').error('Please enter a name', {
          autoClear: true
        });
        _this.resetSignup();
      }
    },
    resetPassword() {
      let firebase = this.get('firebaseApp');
      var auth = firebase.auth();
      let _this = this;
      let email = this.controller.get('logInEmail');

      // this.controller.set('passwordUpdating', true);
      if (email) {
        auth.sendPasswordResetEmail(email).then(function() {
          // Email sent.
          _this.controller.get('notifications').success('A password reset has been sent to your email address', {
            autoClear: true,
            clearDuration: 4000
          });

        }, function(error) {
          // An error happened.
          _this.controller.get('notifications').error(error.message, {
            autoClear: true
          });
          // _this.controller.set('passwordUpdating', false);
        });
      } else {
        _this.controller.get('notifications').success('Please enter your email adress in the box above', {
          autoClear: true,
          clearDuration: 4000
        });
      }
    }
  },
  logIn: function(email, pass) {
    let _this = this;
    _this.get("session").open("firebase", {
      provider: "password",
      email: email,
      password: pass
    }).then((d) => {
      _this.completeLogin(d);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      _this.resetSignup();
      _this.controller.get('notifications').error(errorMessage, {
        autoClear: true
      });
      // ...
    });
  },
  completeLogin: function(d) {
    let _this = this;
    _this.store.findRecord('user', this.get('session.currentUser').uid).then((user) => {
      _this.controller.get('notifications').info('Logged in successfully!.', {
        autoClear: true
      });
      // _this.generateUid().then(() => {
        _this.resetSignup();
        _this.transitionTo('index');
      // });
    }, () => {
      _this.controller.get('notifications').info('User account created.', {
        autoClear: true
      });
      // _this.generateUid().then(() => {
				_this.fillInAccountDetails().then(()=>{
	        _this.resetSignup();
	        _this.transitionTo('user.new');
				});
      // });
    });
  },
  fillInAccountDetails: function() {
		let _this = this;
    return new Promise(function(resolve, reject) {
      let firebase = _this.get('firebaseApp');
      let name = _this.controller.get('name');
      let surname = _this.controller.get('surname');
      var user = firebase.auth().currentUser;
      let provData = _this.get("session.currentUser").providerData[0];
			let full_name = name + " " + surname;
			Ember.set(provData, 'displayNameTemp', full_name);

      user.updateProfile({
        displayName: full_name
      }).then(function() {
        // Update successful.
        resolve();
      }, function(error) {
			// An error happened.
				reject();
      });
    });
  },
  resetSignup: function() {
    this.controller.set('isCreating', false);
    this.controller.set('isLoggingIn', false);
  },
  generateUid: function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
      if (_this.get("session.currentUser")) {
        let provData = _this.get("session.currentUser").providerData[0];
        let _uid;
        if (_this.get("session.provider") === "password") {
          _uid = _this.get("session.currentUser").uid;
          Ember.set(provData, '_uid', _uid);
        } else {
          _uid = _this.get("session.currentUser").providerData[0].uid;
          Ember.set(provData, '_uid', _uid);
        }
        resolve(_this.get("session"));
      } else {
        _this.get('session').close().then(() => {
          reject();
        });
      }
    });
  },
  hashCode: function(str) { //String to hash function
    if (str === undefined) {
      str = '';
    }
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
  }
});
