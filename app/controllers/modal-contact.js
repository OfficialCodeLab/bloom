import Ember from 'ember';

export default Ember.Controller.extend({
	captchaVerified: '',
	notifications: Ember.inject.service('notification-messages'),

	actions: {
	    captchaComplete(data) {
	    	this.set('captchaVerified', true);
	    	this.send('captchaStore', true);
	    }, 
	    captchaExpired(){
	    	this.set('captchaVerified', false);
	    	this.send('captchaStore', false);

	    },
		ok: function() {
			this.sendAction('ok');
		},
		cancel: function(){
			this.sendAction('cancel');
		}
	}
});
