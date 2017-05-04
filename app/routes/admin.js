import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
        }

        //First tier authentication:
        let id = this.get("session").get('currentUser').providerData[0]._uid;
        let user = this.store.peekRecord('user', id);
        if(user.get('accountType') !== 'admin'){
  			this.transitionTo('/404');
    	} else {
    		//Second tier auth (check admin table)
    		this.store.findRecord('adminLogin', id).then(()=>{
    			//found
    		},()=>{
    			//notfound
  				this.transitionTo('/404');
    		});
    	}

        return sesh;
    },
	filepicker: Ember.inject.service(),

	actions: {
	    openFilePicker: function(){
	    	this.get('filepicker.promise').then(function(filepicker){
	            //do something with filepicker
	            filepicker.pick(function(Blob){  console.log(Blob.url);  });
	        });
	    }

	}
});
