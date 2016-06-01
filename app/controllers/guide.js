import Ember from 'ember';

export default Ember.Controller.extend({
	guestsA: Ember.A([]),
	dress:false,
	culinary:false,
	venue:false,
	name: '',
	email: '',
	cell: '',
	guests: 0,
	guestsValue: '0',
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
		toggleFavourite(item){
			let _item = this.get(item);
			if(_item){
				this.set(item, false);
			} else {
				this.set(item, true);				
			}
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
			let guest = {
				name: this.get('name'),
				email: this.get('email'),
				cell: this.get('cell'),
				guests: this.get('guests') + ""
			};
			this.get('guestsA').pushObject(guest);
			console.log(JSON.stringify(this.get('guestsA')));
			this.set('name', '');
			this.set('email', '');
			this.set('cell', '');
			this.set('guests', 0);
			this.set('guestsValue', '0');

		},
		// addGuest(){
		// 	this.set('addingGuest', true);
  //     		let _id = this.get("session").content.currentUser.id + "";
		// 	let wedding = this.store.peekRecord('wedding', _id);
		// 	let guest = this.store.createRecord('guest', {
		// 		name: this.get('name'),
		// 		email: this.get('email'),
		// 		cell: this.get('cell'),
		// 		guests: this.get('guests') + "",
		// 		wedding: wedding
		// 	});
		// 	wedding.get('guests').pushObject(guest);
		// 	wedding.save().then(()=>{
		// 		guest.save().then(()=>{
		// 			this.set('addingGuest', false);
		// 			this.set('name', '');
		// 			this.set('email', '');
		// 			this.set('cell', '');
		// 			this.set('guests', 0);
		// 			this.set('guestsValue', '0');
		// 		});
		// 	});		
		// },
		// checkBox(id){
		// 	let model = this.store.peekRecord('guest', id);
		// 	let rsvp = model.get('rsvp');
		// 	if(rsvp){
		// 		rsvp = false;
		// 	} else {
		// 		rsvp = true;
		// 	}
		// 	model.set('rsvp', rsvp);
		// 	model.save();
		// },
		destroyGuest(guest){
			let confirmation = confirm("Are you sure?");

			if(confirmation){
				this.get('guestsA').removeObject(guest);
			}
		}
	}
});
