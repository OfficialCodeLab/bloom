import Ember from 'ember';

export default Ember.Controller.extend({
  name: '',
  category: '',
  vendor: '',
  imageURL: '',
  names: [], 

  actions: {  	
		selectCat(value){
			this.set('category', value);
		},
		selectVndr(value){
			this.set('vendor', value);
		}
  }
});
