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
  	activate: function(){
  		window.scrollTo(0,0);
  	},

	actions: {
		goBack: function(){
			window.history.go(-1);
			//console.log("This works.");
		}
	}
});