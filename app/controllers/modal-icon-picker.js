import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),

	actions: {
		ok: function() {
			this.sendAction('ok');
		},
		cancel: function(){
			this.sendAction('cancel');
		}
	}
});
