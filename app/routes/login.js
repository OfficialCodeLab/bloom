import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get("session").fetch().catch(function() {});
  },
  afterModel: function() {
    //Ember.$('#menu-button').fadeOut("fast");
    return this.get("session").fetch().catch(function() {});
  },
  actions: {
    login: function(provider) {
        this.get("session").open("firebase", { provider: provider}).then((data) => {
          this.transitionTo('index');
      });
    },
    logout: function() {
      this.get("session").close();
      this.transitionTo('index');
    },
    willTransition(){     
      Ember.$('#menu-button').fadeIn("fast"); 
    },
    didTransition(){
      Ember.$('#menu-button').fadeOut("fast");
      console.log("TEST");
    },
  }
});