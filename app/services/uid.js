import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  uid: Ember.computed('session', function(){
      if (this.get('session.currentUser')) {
        let provData = this.get('session.currentUser').providerData[0];
        if (this.get('session.provider') === "password") {
          return this.get('session.currentUser').uid;
        } else {
          console.log(this.get('session.currentUser'));
          return this.get('session.currentUser').providerData[0].uid;
        }
      } else {
        return null;
      }
  })
});
