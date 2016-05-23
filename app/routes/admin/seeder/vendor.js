import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },
	actions: {
		saveItem(vendorNew){
			 vendorNew.save();
		},

		createItem(){
			var newItem = this.store.createRecord('vendor', {				
			  name: this.controller.get('name'),
			  desc: this.controller.get('desc'),
			  email: this.controller.get('email'),
			});

			newItem.save();			
			this.controller.set('name', '');
			this.controller.set('desc', '');
			this.controller.set('email', '');
		}
	}
});
