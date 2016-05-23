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
		saveItem(catNew){
			 catNew.save();
		},

		createItem(){
			var newItem = this.store.createRecord('category', {				
			  id: this.controller.get('catID'),			
			  name: this.controller.get('name'),		
			  desc: this.controller.get('desc'),	
			  imageURL: this.controller.get('imageURL')
			});

			newItem.save();	
			this.controller.set('catID', '');
			this.controller.set('name', '');
			this.controller.set('imageURL',  '');
			this.controller.set('desc',  '');
		}
	}
});
