import Ember from 'ember';

export default Ember.Route.extend({

	actions: {
		toggleMenu: function () {
			this.controller.toggleProperty('menuOpen');
		}
	}
});
