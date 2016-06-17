import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('user', _id);			
	},
	afterModel(){
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		this.store.findRecord('userstat', _id).then((stats)=>{
			this.controller.set('height', stats.get('height'));
			this.controller.set('shoulders', stats.get('shoulders'));
			this.controller.set('chest', stats.get('chest'));
			this.controller.set('waist', stats.get('waist'));
			this.controller.set('hips', stats.get('hips'));
			this.controller.set('inseam', stats.get('inseam'));
			this.controller.set('shoesize', stats.get('shoesize'));
		}, ()=>{});
	},
	actions:{
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
		},
		updateStats(){
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			this.store.findRecord('userstat', _id).then((stats)=>{
				stats.set('height', this.controller.get('height'));
				stats.set('shoulders', this.controller.get('shoulders'));
				stats.set('chest', this.controller.get('chest'));
				stats.set('waist', this.controller.get('waist'));
				stats.set('hips', this.controller.get('hips'));
				stats.set('inseam', this.controller.get('inseam'));
				stats.set('shoesize', this.controller.get('shoesize'));
				stats.save().then(()=>{
					this.controller.set('responseMessage', 'Changes have been saved!');
				});
			});


		},
		closeMessage(){
			this.controller.set('responseMessage', '');
		}
	}
});
