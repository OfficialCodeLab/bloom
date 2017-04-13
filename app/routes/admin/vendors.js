import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },
	model(){

    	return this.store.findAll('vendor');
    	// return Ember.RSVP.hash({
     //        vendor: this.store.findAll('vendor'),
     //        vendorStat: this.store.findAll('vendor-stat')
     //    });
	},
	// setupController: function (controller, model) {
      // this._super(controller, model);
      // Ember.set(controller, 'vendor', model.vendor);
      // Ember.set(controller, 'vendorStat', model.vendorStat);
    // }
});
