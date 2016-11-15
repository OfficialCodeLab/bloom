import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		//Before creating the record, clear the DS Store
		this.store.unloadAll('user');
        try {
        	let _id = this.get("session").get('currentUser').providerData[0].uid;
            ///return response;
        	//console.log(request);
        	//let surname = this.get("session").get('currentUser').providerData[0].last_name;
        	let full_name = this.get("session").get('currentUser').providerData[0].displayName;
        	let x = full_name.indexOf(" ");
        	let name = full_name.substring(0, x);
        	let surname = full_name.substring(x+1, full_name.length);
			var user = this.store.createRecord('user', {
			  name: name,
			  surname: surname,
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
			//user.save();

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
    	let _id = this.get("session").get('currentUser').providerData[0].uid + "";

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
		saveUser() { 
    		window.scrollTo(0,0);
    		this.controller.get('notifications').success('Saved successfully!',{
			  autoClear: true
			});
			this.transitionTo('index');
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