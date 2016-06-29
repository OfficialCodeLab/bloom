import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	var sesh = this.get("session").fetch().catch(function() {});
	if(!this.get('session.isAuthenticated')){
      this.transitionTo('login');
    }
    return sesh;
  },
  model (){
  	return this.store.findAll('category').then(function(items){
      return items.sortBy('id');
    });
  }
});
