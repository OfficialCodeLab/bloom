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
    
    // willTransition(){     
    //   Ember.$('#menu-button').fadeIn("fast"); 
    // },
    // didTransition(){
    //   Ember.$('#menu-button').fadeOut("fast");
    //   console.log("TEST");
    // },
  }
});
