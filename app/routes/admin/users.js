import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },
	model(){
		return this.store.findAll('user', {reload: true}).then((items) => {
	      return items.sortBy('name');
	    });
	},
	actions: {
		addWedding(id){
			let user = this.store.peekRecord('user', id);
			let wedding = this.store.createRecord('wedding', 
				{
					id: id,
					user: user
				}
			);
			wedding.save();
			user.get('wedding').pushObject(wedding);
			user.save();
		}
	}
});
