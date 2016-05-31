import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		//Before creating the record, clear the DS Store
		this.store.unloadAll('user');
        try {
        	let _id = this.get("session").content.currentUser.id;
			var user = this.store.createRecord('user', {
			  name: this.get("session").content.currentUser.cachedUserProfile.first_name,
			  surname: this.get("session").content.currentUser.cachedUserProfile.last_name,
			  id: _id
			});

			let wedding = this.store.createRecord('wedding', 
				{
					id: _id,
					user: user
				}
			);
			wedding.save();
			user.get('wedding').pushObject(wedding);
			user.save();

	    	return user;

		} catch(ex){
			//If any problems occur, just navigate to index
			this.transitionTo('index');
		}
    },
    beforeModel() {
    	//Get the user ID
	    var sesh = this.get("session").fetch().catch(function() {});
	    if(!this.get('session.isAuthenticated')){
	        // transition.abort();
	        // Default back to homepage
	        this.transitionTo('login');
	    } 
    	let _id = this.get("session").content.currentUser.id + "";

    	//Check the local store first for record of the user
    	var localusr = this.store.peekRecord('user', _id);
    	if(localusr !== null){
			this.transitionTo('index');
    	}

    	//Else check server for the record
    	this.store.findRecord('user', _id).then((response) => {
			 this.transitionTo('index');
     	}, () => {
			Ember.$('#usernew').fadeIn("fast");  //Run relevant jquery methods in component
     	}).catch((err)=>{});

    	
  },
    actions: {
    	
		//If the save user button is clicked
		saveUser(newUser) { 
    		window.scrollTo(0,0);
			this.transitionTo('about');
		},

		willTransition() {
			//Saves the model regardless of how the user navigates
			this.controller.get('model').save();
		},
		didInsertElement(){
			Ember.$('#usernew').fadeOut(0);    //Run relevant jquery methods in component
		}
  }

});