import Ember from 'ember';

export default Ember.Controller.extend({
	action: {
		ok: function() {
			this.sendAction('ok');
		}
	}
});
