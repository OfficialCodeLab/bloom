import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {
    var sesh = this.get("session").fetch().catch(function() {});
    if(this.get('session.isAuthenticated')){
        // transition.abort();
        // Default back to homepage
        this.transitionTo('index');
    } 
    return sesh;
  },
  // afterModel: function() {
  //   //Ember.$('#menu-button').fadeOut("fast");
  //   return this.get("session").fetch().catch(function() {});
  // },
  // backgrounds: ['../../public/assets/images/bg1.jpg', '../../public/assets/images/6.jpg', '../../public/assets/images/splash1.jpg'],
   actions: {
  //   login: function(provider) {
  //       this.get("session").open("firebase", { provider: provider}).then((data) => {
  //         this.transitionTo('index');
  //     });
  //   },
  //   logout: function() {
  //     this.get("session").close();
  //     this.transitionTo('index');
  //   },
  //   willTransition(){     
  //     Ember.$('#menu-button').fadeIn("fast"); 
  //   },
  },

});