import Ember from 'ember';

export default Ember.Controller.extend({
	showPartial: Ember.computed.or('showAdd', 'showList'),
	showAdd: '',
	showList: '',
	name: '',
	email: '',
	cell: '',
	guests: 0,
	guestsValue: '0',
	addingGuest: '',
	isNotValid: Ember.computed.not('name'),
	numberObserver: Ember.observer('guestsValue', function() {
        let num = this.get('guests');
        let txtvalue = this.get('guestsValue');
        let numvalue = parseFloat(txtvalue);
        if(!isNaN(txtvalue)){
        	if(numvalue % 1 !== 0){
        		this.set('guests', Math.floor(numvalue));
        		this.set('guestsValue', Math.floor(numvalue) + "");
        	} else {
	        	if(numvalue < 0){
	        		this.set('guests', 0);
	        		this.set('guestsValue', '0');
	        	} else if (numvalue > 20) {
	        		this.set('guests', 20);
	        		this.set('guestsValue', '20');
	        	}        		
        	}
        } else {
    		this.set('guestsValue', num + "");
        }

	}),
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
		incrementNumber(){
			let num = this.get('guests');
			num++;
			this.set('guests', num);
			this.set('guestsValue', num + "");
		},
		decrementNumber(){
			let num = this.get('guests');
			num--;
			this.set('guests', num);
			this.set('guestsValue', num + "");
		},
		addGuest(){
			this.set('addingGuest', true);
      		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			let wedding = this.store.peekRecord('wedding', _id);
			let guest = this.store.createRecord('guest', {
				name: this.get('name'),
				email: this.get('email'),
				cell: this.get('cell'),
				guests: this.get('guests') + "",
				wedding: wedding,
				mustEmail: true
			});
			wedding.get('guests').pushObject(guest);
			wedding.save().then(()=>{
				guest.save().then(()=>{
					this.set('addingGuest', false);
					this.set('name', '');
					this.set('email', '');
					this.set('cell', '');
					this.set('guests', 0);
					this.set('guestsValue', '0');
				});
			});		
		},
		checkBox(id){
			let model = this.store.peekRecord('guest', id);
			let rsvp = model.get('rsvp');
			if(rsvp){
				rsvp = false;
			} else {
				rsvp = true;
			}
			model.set('rsvp', rsvp);
			model.save();
		},
		destroyGuest(id){
			let confirmation = confirm("Are you sure?");

			if(confirmation){
				let model = this.store.peekRecord('guest', id);
				model.destroyRecord();
			}
		}
	}
});
