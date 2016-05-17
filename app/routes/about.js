import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	var sesh = this.get("session").fetch().catch(function() {});
	if(!this.get('session.isAuthenticated')){
      this.transitionTo('login');
    }
    return sesh;
  },
  	model() {
    	return this.store.createRecord('contact');
  	},


	actions: {

		saveContact(newContact) {
			newContact.save().then(() => {
        		this.controller.get('model').set('email', '');
        		this.controller.get('model').set('message', '');
        		this.controller.get('model').set('responseMessage', 'KTHNXBAI');
			});
	    },

	    willTransition() {
	      // rollbackAttributes() removes the record from the store
	      // if the model 'isNew'
		  this.controller.get('model').set('responseMessage', '');
	      this.controller.get('model').rollbackAttributes();
	    },
	    closeMessage() {
	    	this.controller.get('model').set('responseMessage', '');
	    },
	    guidedSearch(){	    	
    		window.scrollTo(0,0);
			this.transitionTo('index');
	    }

	}
});
