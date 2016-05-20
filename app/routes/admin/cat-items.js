import Ember from 'ember';

export default Ember.Route.extend({

	model() {
    	return this.store.createRecord('cat-item');
  	},

	actions: {
		saveItem(catItemNew){
			 catItemNew.save();
		}
	}
});
