import Ember from 'ember';

export default Ember.Controller.extend({
	dress:false,
	culinary:false,
	venue:false,
	actions: {
		toggleFavourite(item){
			let _item = this.get(item);
			if(_item){
				this.set(item, false);
			} else {
				this.set(item, true);				
			}
		}
	}
});
