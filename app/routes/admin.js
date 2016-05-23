import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
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
