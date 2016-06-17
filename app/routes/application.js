import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
        return this.get("session").fetch().catch(function() {});
    },
	model: function() {
		//check server for the record of self
		try
		{
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			return this.store.findRecord('user', _id);			
		} catch(ex) {}
		
	    // return new Ember.RSVP.Promise(function(resolve) {
	    //   setTimeout(resolve, 3000);
	    // });
  },

  afterModel: function (model, transition) {
    Ember.$('.loading-overlay').fadeOut("fast");
  },
	actions: {
		toggleMenu: function () {
			if(this.controller.get('menuOpen')){
   				Ember.$('#menu-overlay').fadeOut("slow");
   				Ember.$('#menu-icon-c').fadeOut(0);
   				Ember.$('#menu-icon-o').fadeIn("fast");
				this.controller.toggleProperty('menuOpen');
				//console.log("TEST" + this.controller.menuOpen);
			} else{
   				Ember.$('#menu-overlay').fadeIn("slow");
   				Ember.$('#menu-icon-o').fadeOut(0);
   				Ember.$('#menu-icon-c').fadeIn("fast");
				this.controller.toggleProperty('menuOpen');
				//console.log("TEST" + this.controller);
			}
		},
		didTransition() {
			Ember.$('#menu-overlay').fadeOut("slow");
			Ember.$('#menu-icon-c').fadeOut(0);
			Ember.$('#menu-icon-o').fadeIn("fast");
			this.controller.set('menuOpen', false);
		},
		login: function(provider) {
			let _that = this;
	        this.get("session").open("firebase", { 
	        	provider: provider, 
	        	settings: {
	    			scope: 'public_profile,user_friends',
				}
			}).then((data) => {
	    		//alert("Your id is: " + this.get("session").get('currentUser').providerData[0].uid);
				
	          this.store.findRecord('user', data.currentUser.id).then(()=>{
	          	this.transitionTo('index');
	          });
          });
	    },
	    logout: function() {
	      this.get("session").close();
	      this.transitionTo('login');
	    },
	    showId: function(){
	    	alert("Your id is: " + JSON.stringify(this.get("session").content.currentUser));
	    },
	    navigateCat: function(){
	    	this.transitionTo("categories");
	    },
	    addFavourite: function(id){
	    	let user = this.store.peekRecord('user', this.get("session").get('currentUser').providerData[0].uid);
	    	let item = this.store.peekRecord('cat-item', id);
	    	user.get('favourites').pushObject(item);
	    	user.save();
	    },
	    removeFavourite: function(id){
	    	let user = this.store.peekRecord('user', this.get("session").get('currentUser').providerData[0].uid);
	    	let item = this.store.peekRecord('cat-item', id);
	    	user.get('favourites').removeObject(item);
	    	user.save();
	    },
	    error: function(error) {
	      //Ember.Logger.error(error);
	      this.get("session").close();
      	  this.transitionTo('login');
	    }
	    // loading: function(transition, originRoute) {
		   // //this.controller.set('currentlyLoading', true);
		   // let controller = this.controllerFor('loading');
		   // alert("loading: " + controller.get('model').get('currentlyLoading'));
	    //   // displayLoadingSpinner();

	    //   // Return true to bubble this event to `FooRoute`
	    //   // or `ApplicationRoute`.
	    //   transition.promise.finally(function() {
		   // controller.set('currentlyLoading', false);
		   // alert("loading: " + controller.get('currentlyLoading'));
	    //   });
	    // }
	



		/*
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
