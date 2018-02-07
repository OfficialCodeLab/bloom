import Ember from 'ember';

export default Ember.Controller.extend({
	captchaVerified: '',
	notifications: Ember.inject.service('notification-messages'),

	actions: {
	    captchaComplete(data) {
	    	this.set('captchaVerified', true);
	    }, 
	    captchaExpired(){
	    	this.set('captchaVerified', false);

	    }
	}
});
