import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
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
    }
  }
});