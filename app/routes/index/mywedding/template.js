import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		sendInvites: function () {

	    	this.controller.get('notifications').warning('Functionality coming soon!',{
                autoClear: true
            });  
		}
	}
});
