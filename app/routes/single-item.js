import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },
    model(params) {
    	return this.store.findRecord('catItem', params.catItem_id);
  	},
  	setupController(controller, model) {
	    this._super(controller, model);

	    // controller.set('title', 'Edit library');
	    // controller.set('buttonLabel', 'Save changes');
  	},
	actions: {
		goBack: function(){
			window.history.go(-1);
			//console.log("This works.");
		},
		priceClick: function(){
			alert("TEST");
	    	window.scrollTo(0, 0);
			// let id = this.controller.get('model.vendor.id')
			// this.send('vendorClick', id);
		},

	    openContactModalInit: function(){
	    	let venName = this.controller.get('model.vendor.name');
	    	let venEmail = this.controller.get('model.vendor.email');
	    	let venId = this.controller.get('model.vendor.id');
	    	this.send('openContactModal', venName, venEmail, venId);
	    },
	}
});