import Ember from 'ember';

export default Ember.Component.extend({
	login: '',
	signUp: '',

	actions: {
		loginRoute: function (){
			this.set('login', true);
		},
		signupRoute: function(){
			this.set('signUp', true);
		},
		backBtn: function (){
			this.set('login', false);
			this.set('signup', false);

		}
	}
});
