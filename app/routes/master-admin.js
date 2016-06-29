import Ember from 'ember';

const PAGE_SIZE = 7;

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
    return this.store.findAll('user', {reload: true}).then((users) => {
      if (!(this.get('startAt'))) {
        this.resetIndexes();
      }
      let sortedUsers = users.sortBy('name');
      return sortedUsers.slice(this.get('startAt'), this.get('endAt'));
    });
  },

  actions: {

    prev: function() {
      var id = this.get('currentModel').get('firstObject.id');
      var users = this.store.peekAll('user');
      if(this.get('startAt') - PAGE_SIZE >= 0){
        let diff = this.get('endAt') - this.get('startAt');
        if(diff < PAGE_SIZE){
          this.set('endAt', this.get('startAt'));
        } else {
          this.set('endAt', this.get('endAt') - PAGE_SIZE);
        }
        this.set('startAt', this.get('startAt') - PAGE_SIZE);
      } else {        
        this.resetIndexes();
      }

      this.refresh();
    },

    next: function() {
      var id = this.get('currentModel').get('lastObject.id');
      var users = this.store.peekAll('user');
      if(this.get('startAt') + PAGE_SIZE < users.get('length')){
        this.set('startAt', this.get('startAt') + PAGE_SIZE);
        if(this.get('endAt') + PAGE_SIZE < users.get('length')){
          this.set('endAt', this.get('endAt') + PAGE_SIZE);
        } else {
          this.set('endAt', users.get('length'));
        }
      } 

      this.refresh();
    }

  },
  resetIndexes: function() { 
      var users = this.store.peekAll('user');   
      this.set('startAt', 0);
      if(PAGE_SIZE < users.get('length')){        
        this.set('endAt', PAGE_SIZE);
      }
      else{
        this.set('endAt', users.get('length'));
      }
  }
  
});
