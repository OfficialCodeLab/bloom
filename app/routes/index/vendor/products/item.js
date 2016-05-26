import Ember from 'ember';

export default Ember.Route.extend({

	model(params){
		return Ember.RSVP.hash({
	    	catItem: this.store.findRecord('catItem', params.catItem_id),
			category: this.store.findAll('category')
	    });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    Ember.set(controller, 'catItem', model.catItem);
	    Ember.set(controller, 'category', model.category);
	  },
	actions: {
		goBack: function(){
			window.history.go(-1);
		},
		destroyItem: function(model){
			let confirmation = confirm('Are you sure?');

	        if (confirmation) {
				model.destroyRecord();
				this.transitionTo('index.vendor');
	        }
		},
		updateItem: function(model){
			let _cat = this.controller.get('category') + "";
			if(_cat.charAt(0) != '<'){
				//alert(_cat);
				let cat = this.store.peekRecord('category', this.controller.get('category'));
				model.set('category', cat);
			}
			model.save().then(() => {
				this.transitionTo('index.vendor');
			});
		},
		willTransition() {
	      // rollbackAttributes() removes the record from the store
	      // if the model 'isNew'
	      this.controller.get('model.catItem').rollbackAttributes();
	    }
	},
	uiSetup: function(){
	   // do magic here...
	}.on('didInsertElement').observes('model') 
});
