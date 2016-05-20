import Ember from 'ember';

export default Ember.Route.extend({

init: function(){

},


beforeModel: function() {

  // var cw = this.get('.category-block').width();
  // Ember.$('.category-block').css({'height':cw+'px'});
  // this.get('.category-block').css({'height':'300px'});



	var sesh = this.get("session").fetch().catch(function() {});
	if(!this.get('session.isAuthenticated')){
      this.transitionTo('login');
    }
    return sesh;
  },

  model() {
    return this.store.findAll('cat-item');
  },


  actions: {
      showSingle: function(){
        this.transitionTo('index.item-single');
      }
  }
});
