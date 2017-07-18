import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {

  		storeMasonryRef(ref){
  			this.set('masonryRef', ref);
  		}
  }
});
