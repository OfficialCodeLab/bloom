import Ember from 'ember';

const PAGE_SIZE = 5;

export default Ember.Route.extend({
  startAt: null,
  endAt: null,
  beforeModel: function() {
  	var sesh = this.get("session").fetch().catch(function() {});
  	if(!this.get('session.isAuthenticated')){
        this.transitionTo('login');
      } else{
        //this.store.findRecord('user', this.get("session").get('currentUser').providerData[0].uid).then(()=>{},()=>this.transitionTo('user.new'));

      }
      return sesh;
  },
  model: function() {
    var query = {
      limitToFirst: PAGE_SIZE + 1
    };

    if (this.get('startAt')) {
      query.startAt = this.get('startAt');
    }

    if (this.get('endAt')) {
      query.endAt = this.get('endAt');
      delete query.limitToFirst;
      query.limitToLast = PAGE_SIZE + 1;
    }

    return this.store.findAll('user').then((users) => {
      if (this.get('startAt')) {
        return users.slice(1);
      } else {
        return users.slice(0, users.get('length') - 1);
      }
    });
  },

  actions: {

    prev: function() {
      var id = this.get('currentModel').get('firstObject.id');
      this.set('startAt', null);
      this.set('endAt', id);
      this.refresh();
    },

    next: function() {
      var id = this.get('currentModel').get('lastObject.id');
      this.set('startAt', id);
      this.set('endAt', null);
      this.refresh();
    }

  }
});
