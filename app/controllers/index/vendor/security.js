import Ember from 'ember';

export default Ember.Controller.extend({
	showEmailPartial: '',
	showPasswordPartial: '',
	password: '',
	passwordConfirm: '',
	email: '',
	isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
	isNotValidEmail: Ember.computed.not('isValidEmail'),
	noPassword: Ember.computed.not('password'),
	showPartial: Ember.computed.or('showEmailPartial', 'showPasswordPartial'),
	actions: {
		showPasswordChangePartial(){
			this.set('showPasswordPartial', true);
		},

		showEmailChangePartial(){
			this.set('showEmailPartial', true);
		},
		backBtn(){
			this.set('showPasswordPartial', false);
			this.set('showEmailPartial', false);
		}
	}
});
