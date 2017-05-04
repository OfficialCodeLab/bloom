import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
		// return this.store.findRecord('user', _id);	
		return Ember.RSVP.hash({
	      user: this.store.peekRecord('user', _id),
	      userstat: this.store.findRecord('userstat', _id)
	    });		
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    Ember.set(controller, 'userstat', model.userstat);
	    Ember.set(controller, 'user', model.user);
	},
	afterModel(){
		// let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
		// this.store.findRecord('userstat', _id).then((stats)=>{
		// 	this.controller.set('height', stats.get('height'));
		// 	this.controller.set('shoulders', stats.get('shoulders'));
		// 	this.controller.set('chest', stats.get('chest'));
		// 	this.controller.set('waist', stats.get('waist'));
		// 	this.controller.set('hips', stats.get('hips'));
		// 	this.controller.set('inseam', stats.get('inseam'));
		// 	this.controller.set('shoesize', stats.get('shoesize'));
		// }, ()=>{});
	},
	actions:{
		
		updateStats(){
			let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
			let userstats = this.store.peekRecord('userstat', _id);
			userstats.save().then(()=>{
				this.controller.get('notifications').success('Changes have been saved!',{
					  autoClear: true
					});
			});
			


		},
		selectGender(gender){
			let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
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
		},
		error: function(error) {
			this.transitionTo('index.favourites.selectgender');
	    },
		closeMessage(){
			this.controller.set('responseMessage', '');
		}
	}
});
