import Ember from 'ember';

export default Ember.Route.extend({
	model(){
    	return this.store.findAll('user');
	},

	actions: {
		acceptReq: function(id){
			let user = this.store.peekRecord('user', id);
			user.set('vendorRequest', false);
			user.set('accountType', 'vendor');
			user.save();
		},
		declineReq: function(id){
			let user = this.store.peekRecord('user', id);
			user.set('vendorRequest', false);
			user.save();			
		}	
	}
	
});
