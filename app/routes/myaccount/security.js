import Ember from 'ember';

export default Ember.Route.extend({
	firebaseApp : Ember.inject.service(),
	setupController(controller, model) {
	    this._super(controller, model);
	    if(this.get("session").get('currentUser').providerData[0].providerId === "password") {
	    	controller.set('isPasswordAccount', true);
	    }
	  },
	  actions: {
	  	resetPassword() {	  	
	    	let firebase = this.get('firebaseApp');
	  		var auth = firebase.auth();
	  		let _this = this;
			let email = this.get("session").get('currentUser').providerData[0].uid + "";
			this.controller.set('passwordUpdating', true);

			auth.sendPasswordResetEmail(email).then(function() {
			  // Email sent.
			  	_this.controller.get('notifications').success('A password reset has been sent to your email address',{
				    autoClear: true,
				    clearDuration: 4200
				});	
				_this.controller.set('passwordUpdating', false);
				_this.transitionTo('logout');
			  	_this.controller.get('notifications').info("Please change your password and sign in again.",{
				    autoClear: true,
				    clearDuration: 4200
				});	

			}, function(error) {
			  // An error happened.
			  	_this.controller.get('notifications').error(error.message,{
				    autoClear: true
				});	
				_this.controller.set('passwordUpdating', false);
			});
	  	},
	  	showChangeEmail() {
	  		this.controller.set('section0', false);
	  	},
	  	hideChangeEmail () {
	  		this.controller.set('section0', true);
	  	},
	  	changeEmail() {
			let _id = this.get("currentUser.uid") + "";
	    	let firebase = this.get('firebaseApp');
	    	let _this = this;
	  		var user = firebase.auth().currentUser;
			_this.controller.set('emailUpdating', true);
	  		//maybe check for valid email?

			user.updateEmail(this.controller.get('newEmail')).then(function() {
			  // Update successful.
			  _this.store.findRecord('user', _id).then((user)=>{
			  	user.set('email', _this.controller.get('newEmail'));
			  	user.save().then(()=>{
				  	_this.controller.get('notifications').success("Email address has been updated!",{
					    autoClear: true,
					    clearDuration: 4200
					});	
					_this.controller.set('emailUpdating', false);	
					_this.transitionTo('logout'); 
				  	_this.controller.get('notifications').info("Please log in with your new email address",{
					    autoClear: true,
					    clearDuration: 4200
					});			
			  	});
			  });
			}, function(error) {
			  // An error happened.
			  	_this.controller.get('notifications').error(error.message,{
				    autoClear: true
				});	
				_this.controller.set('emailUpdating', false);
			});

	  	}
	  }
});
