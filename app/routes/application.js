import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		toggleMenu: function () {
			if(this.controller.get('menuOpen')){
   				Ember.$('#menu-overlay').fadeOut("slow");
				this.controller.toggleProperty('menuOpen');
			} else{
   				Ember.$('#menu-overlay').fadeIn("slow");
				this.controller.toggleProperty('menuOpen');
			}
		},
		willTransition() {
   				Ember.$('#menu-overlay').fadeOut("slow");
   				this.controller.set('menuOpen', false);
		}/*
		login: function (provider){	
			var ref = new Firebase("https://pear-server.firebaseio.com");
			ref.authWithOAuthPopup(provider, function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    // the access token will allow us to make Open Graph API calls
			    console.log("LOGGED IN AS: " + authData.name);
			  }
			});		
		    // this.get("session").open("firebase", { provider: provider}).then((data) => {
		    //   this.transitionTo('index');
		  //}); 
		}*/
		// login: function(provider) {
  //   	  this.get("session").open("firebase", { provider: provider}).then((data) => {
  //         console.log("LOGGED IN AS: " + data.name);
	 //      });
	 //    },
	 //    logout: function() {
	 //      this.get("session").close();
	 //      this.transitionTo('index');
	 //    }
	}/*,
	
	setupController: function(controller, model) {
		this.controller.set('menuOpen', false)
		console.log("TEST" + this.controller.get('menuOpen'));
		Ember.$('#menu-overlay').fadeOut("slow");
		

  	}*/
});
