import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },
	model () {
	  //Before creating the record, clear the DS Store
		return Ember.RSVP.hash({
		  vendor: this.store.findAll('vendor'),
	      category: this.store.findAll('category')
	    });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    Ember.set(controller, 'vendor', model.vendor);
	    Ember.set(controller, 'category', model.category);
    },

	actions: {
		saveItem(catItemNew){
			 catItemNew.save();
		},

		createItem(){
			try{
				let cat = this.store.peekRecord('category', this.controller.get('category'));
				let vndr = this.store.peekRecord('vendor', this.controller.get('vendor'));
				let newItem = this.store.createRecord('cat-item', {				
				  name: this.controller.get('name'),
				  category: cat,
				  vendor: vndr,
				  imageURL: this.controller.get('imageURL')
				});
				newItem.save();
				cat.get('catItems').pushObject(newItem);
				cat.save();			
				vndr.get('catItems').pushObject(newItem);
				vndr.save();
				this.controller.set('name', '');
				this.controller.set('imageURL', '');
			} catch(ex){
				alert("Please select a category and vendor");
			}
		}
	}
});
