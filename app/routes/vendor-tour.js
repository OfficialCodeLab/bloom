import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
		var sesh = this.get("session").fetch().catch(function() {});
	    return sesh;
	},
	model (){
	  	return this.store.findAll('category', {reload: true}).then(function(items){
	  		let sorted = items.sortBy('id');
	      return sorted.slice(0, 8);
	    });
	  }
});
