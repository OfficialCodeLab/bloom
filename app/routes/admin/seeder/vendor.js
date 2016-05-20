import Ember from 'ember';

export default Ember.Route.extend({
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
		}
	}
});
