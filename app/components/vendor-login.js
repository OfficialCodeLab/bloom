import Ember from 'ember';

export default Ember.Component.extend({
	showButtons: '',
	login: '',
	signUp: '',

	actions: {
		loginRoute: function (){
			this.set('showButtons', true);
			this.set('login', true);
		},
		signupRoute: function(){
			this.set('showButtons', true);
			this.set('signUp', true);
		},
		backBtn: function (){
			this.set('showButtons', false);
			this.set('login', false);
			this.set('signup', false);

		}
	}
});
