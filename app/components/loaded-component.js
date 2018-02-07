import Ember from 'ember';

export default Ember.Component.extend({
	willInsertElement: function (controller, model){
		this._super(controller, model);
		Ember.$('#menu-overlay').fadeOut("slow");

	}
});
