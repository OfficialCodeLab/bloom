import Ember from 'ember';

export default Ember.Route.extend({

	actions: {
		saveItem(catItemNew){
			 catItemNew.save();
		},

		createItem(){
			var newItem = this.store.createRecord('cat-item', {				
			  name: this.controller.get('name'),
			  category: this.controller.get('category'),
			  vendor: this.controller.get('vendor'),
			  imageURL: this.controller.get('imageURL')
			});

			newItem.save();
		}
	}
});
