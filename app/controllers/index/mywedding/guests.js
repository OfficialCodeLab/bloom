import Ember from 'ember';

export default Ember.Controller.extend({
	showPartial: Ember.computed.or('showAdd', 'showList'),
	showAdd: '',
	showList: '',
	name: '',
	email: '',
	cell: '',
	guests: 0,
	actions: {
		showGuestAdd(){
			this.set('showAdd', true);
		},
		showGuestList(){
			this.set('showList', true);
		},
		backBtn(){
			this.set('showList', false);
			this.set('showAdd', false);
		},
		addGuest(){
      		let _id = this.get("session").content.currentUser.id + "";
			let guestList = this.store.peekRecord('guestList', _id);
			let guest = this.store.createRecord('guest', {
				name: this.get('name'),
				email: this.get('email'),
				cell: this.get('cell'),
				guests: this.get('guests') + "",
				guestList: guestList
			});
			guestList.get('guests').pushObject(guest);
			guestList.save().then(()=>{
				guest.save().then(()=>{
					this.set('name', '');
					this.set('email', '');
					this.set('cell', '');
					this.set('guests', 0);
				});
			});		
		}
	}
});
