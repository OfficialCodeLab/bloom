import Ember from 'ember';

export default Ember.Controller.extend({
	showPartial: Ember.computed.or('showAdd', 'showList'),
	notifications: Ember.inject.service('notification-messages'),
	showAdd: '',
	isSelected0: true,
	isSelected1: false,
	isSelected2: false,
	isSelected3: false,
	showList: '',
	name: '',
	email: '',
	cell: '',
	guests: 0,
	checked: true,
	guestId: '',
	guestsValue: '0',
	addingGuest: '',
	isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
	isValid: Ember.computed.and('name', 'isValidEmail'),
	isNotValid: Ember.computed.not('isValid'),
	isDisabled: Ember.computed.or('isNotValid', 'addingGuest'),
	// numberObserver: Ember.observer('guestsValue', function() {
 //        let num = this.get('guests');
 //        let txtvalue = this.get('guestsValue');
 //        let numvalue = parseFloat(txtvalue);
 //        if(!isNaN(txtvalue)){
 //        	if(numvalue % 1 !== 0){
 //        		this.set('guests', Math.floor(numvalue));
 //        		this.set('guestsValue', Math.floor(numvalue) + "");
 //        	} else {
	//         	if(numvalue < 0){
	//         		this.set('guests', 0);
	//         		this.set('guestsValue', '0');
	//         	} else if (numvalue > 20) {
	//         		this.set('guests', 20);
	//         		this.set('guestsValue', '20');
	//         	}        		
 //        	}
 //        } else {
 //    		this.set('guestsValue', num + "");
 //        }

	// }),
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
      		let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
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
					this.get('notifications').success('Guest added!',{
					  autoClear: true
					});
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
      		let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
			let wedding = this.store.peekRecord('wedding', _id);
			let model = this.store.peekRecord('guest', id);
			let rsvp = model.get('rsvp');
			if(rsvp){
				rsvp = false;
			} else {
				rsvp = true;
			}
			model.set('rsvp', rsvp);
			model.save().then(()=>{
				// let rsvpTotal = wedding.get('guestsAttending');
				// if(rsvpTotal===null){
				// 	rsvpTotal = 0;
				// } else {
				// 	rsvpTotal = parseInt(rsvpTotal);
				// }

				// if(rsvp){
				// 	rsvpTotal--;
				// } else {
				// 	rsvpTotal++;
				// }

				// wedding.set('guestsAttending', rsvpTotal);
				// wedding.save().then(()=>{
					this.get('notifications').success('Guest attendance updated!',{
						autoClear: true
					});					
				// });
			});
		},
		destroyGuest(id){

			let _modalData;
			this.set('guestId', id);
			if(this.get('modalDataId')){
				_modalData = this.store.peekRecord('modal-data', this.get('modalDataId'));
				_modalData.set('mainMessage', 'Do you want to remove this guest from your wedding?');	
				_modalData.set('action', 'delete');	
            	this.send('showModal', 'modal-confirm', _modalData);	            	
            } else {
		    	let _modalData = this.store.createRecord('modal-data', {'mainMessage': 'Do you want to remove this guest from your wedding?', 'action': 'delete'});
		     	this.set('modalDataId', _modalData.get('id'));
            	this.send('showModal', 'modal-confirm', _modalData);
            } 
		}
	}
});
