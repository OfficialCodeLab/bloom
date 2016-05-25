import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		logout: function(){			
	    	let user = this.store.peekRecord('user', this.get("session").content.currentUser.id);
	    	user.set('vendorAccount', '');
	    	user.save();
	    	this.transitionTo('index.vendor.login');
		}
	}
});
