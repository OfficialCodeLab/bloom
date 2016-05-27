import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },


  model () {
    return this.store.findAll('cat-item');
  },
  actions:{
  	  logModels(){
  	      let _allModels = this.store.findAll('cat-item').then((_allModels) => {
  	      		let _items = this.controller.get('items');
  	          	_allModels.forEach(function(item){
					let _item = {
						"name": item.get('name'),
						"id": item.get('id'),
						"imgUrl": item.get('imageURL')
					};
					_items.pushObject(item);
				});
  	      });
  	  }
  }
});
