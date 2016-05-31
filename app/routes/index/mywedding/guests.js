import Ember from 'ember';

export default Ember.Route.extend({
	model(){		
		let _id = this.get("session").content.currentUser.id + "";
		return this.store.findRecord('wedding', _id);	
	}
        
});