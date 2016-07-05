import Ember from 'ember';

export default Ember.Route.extend({

  model(){
    let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('user', _id);
  }
});
