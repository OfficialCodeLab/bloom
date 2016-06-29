import Ember from 'ember';

const PAGE_SIZE = 10;

export default Ember.Route.extend({
  startAt: null,
  endAt: null,
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },


  model () {
    return this.store.findAll('cat-item', {reload: true}).then((items) => {
      if (!(this.get('startAt'))) {
        this.resetIndexes();
      }
      //let sorted = items.sortBy('name');
      	return items.slice(this.get('startAt'), this.get('endAt'));
    });
  },

  actions: {
  	

    prev: function() {
      var id = this.get('currentModel').get('firstObject.id');
      //var items = this.store.peekAll('cat-item');
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
      console.log("START AT: " + this.get('startAt') + "\nEND AT: " + this.get('endAt'));

      this.refresh();
    },

    next: function() {
      var id = this.get('currentModel').get('lastObject.id');
      var items = this.store.peekAll('cat-item');
      if(this.get('startAt') + PAGE_SIZE < items.get('length')){
        this.set('startAt', this.get('startAt') + PAGE_SIZE);
        if(this.get('endAt') + PAGE_SIZE < items.get('length')){
          this.set('endAt', this.get('endAt') + PAGE_SIZE);
        } else {
          this.set('endAt', items.get('length'));
        }
      } 
      console.log("START AT: " + this.get('startAt') + "\nEND AT: " + this.get('endAt'));

      this.refresh();
    }

  },
  resetIndexes: function() { 
      var items = this.store.peekAll('cat-item');   
      this.set('startAt', 0);
      if(PAGE_SIZE < items.get('length')){        
        this.set('endAt', PAGE_SIZE);
      }
      else{
        this.set('endAt', items.get('length'));
      }
  },
  	  
});
