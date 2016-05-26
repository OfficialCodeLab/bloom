import Ember from 'ember';

export default Ember.Controller.extend({
	captchaVerified: '',

	actions: {
	    captchaComplete(data) {
	    	this.set('captchaVerified', true);
	    }, 
	    captchaExpired(){
	    	this.set('captchaVerified', false);

	    }
	}
});
