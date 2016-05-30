import Ember from 'ember';

export default Ember.Route.extend({

	model(){
      	let _id = this.get("session").content.currentUser.id + "";
		this.store.findRecord('guestList', _id).then((list) => {
			return list;
		}, ()=>{
			let list = this.store.createRecord('guestList', {
				id: _id
			});
			list.save();
			return list;
		});
	}
        
});