import Ember from 'ember';

export default Ember.Route.extend({
	model(){		
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('user', _id);	
	},
	afterModel(){
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		let user = this.store.peekRecord('user', _id);	
		if(user.get('hasGender') !== false){			
			this.transitionTo('index.favourites.mystats');
		}
	},

	actions: {
		selectGender(gender){
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			let user = this.store.peekRecord('user', _id);
			if(gender === 'male'){
				user.set('isFemale', false);
			} else{
				user.set('isFemale', true);
			}
			user.set('hasGender', true);
			user.save();
			let stats = this.store.createRecord('userstat', {
				id: _id,
				name: user.get('name') + " " + user.get('surname')
			});
			stats.save();
			this.transitionTo('index.favourites.mystats');
		}
	}
});
