import Ember from 'ember';

export default Ember.Route.extend({

	model(params){
		return this.store.findRecord('vendor', params.vendor_id);
	},
  	activate: function(){
  		window.scrollTo(0,0);
  	},
});
