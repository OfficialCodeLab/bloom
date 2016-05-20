import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		saveItem(catNew){
			 catNew.save();
		},

		createItem(){
			var newItem = this.store.createRecord('category', {				
			  name: this.controller.get('name'),			
			  imageUrl: this.controller.get('imageUrl')
			});

			newItem.save();
		}
	}
});
