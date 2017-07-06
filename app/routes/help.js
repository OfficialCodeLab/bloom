import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    var sesh = this.get("session").fetch().catch(function() {});
    return sesh;
  }
});
