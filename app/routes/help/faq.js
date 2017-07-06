import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    toggleIsUsers() {
      this.controller.set('isVendors', false);
    },
    toggleIsVendors() {
      this.controller.set('isVendors', true);
    }

  },
  model (){
		return Ember.RSVP.hash({
	      vendorFaq: this.store.findAll('vendorFaq'),
	      userFaq: this.store.findAll('userFaq')
	    });
  },
	setupController(controller, model) {
	    this._super(controller, model);
	    Ember.set(controller, 'vendorFaq', model.vendorFaq);
	    Ember.set(controller, 'userFaq', model.userFaq);
	 }
});
