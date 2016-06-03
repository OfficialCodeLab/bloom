import Ember from 'ember';

const EmberPieComponent = Ember.Component.extend({
	allGuests: 0,
	attendingGuests: 0,
	chartData: [],
  	storeName: '',

	willInsertElement: function(){
		this.set('storeName', this.get('targetObject.store'));
        let store = this.get('storeName');
        let _id = this.get('userid');

        console.log("Wedding: " + store.peekRecord('wedding', _id));
		let _guests = store.peekRecord('wedding', _id).get('guests');

		_guests.forEach(function(guest){	
			console.log(guest.get('name'));
		});
	},
	didInsertElement: function(){
       	this.set('storeName', this.get('targetObject.store'));

        let store = this.get('storeName');
		let _id = this.get('userid');
		//Print out the model in the console on action trigger
		let _guests = store.peekRecord('wedding', _id).get('guests');
		//console.log(JSON.stringify(_guests));

		var totalUsers = 0;
		var totalAttending = 0;
		//Tick through array
		_guests.forEach(function(guest){	
			if (guest.get('rsvp') === true){
				console.log("Additional guests for " + guest.get('name') +" : " + guest.get('guests'));
				totalAttending += parseInt("1") + parseInt(guest.get('guests'));
			}
			totalUsers = totalUsers + parseInt("1") + parseInt(guest.get('guests'));
		});

		console.log("Attending Guests: " + totalAttending);

		this.set('allGuests', totalUsers);
		this.set('attendingGuests', totalAttending);

		this.set('chartData', Ember.A([
			{
		        value: totalUsers - totalAttending,
		        color: "#F7464A",
		        highlight: "#FF5A5E",
		        label: "Not Attending"
		    }, 
		    {
		        value: totalAttending,
		        color: "#46BFBD",
		        highlight: "#5AD3D1",
		        label: "Attending"
		    }
    	]));

    	console.log("Chart Data: " + JSON.stringify(this.get('chartData')));
	}
});

EmberPieComponent.reopenClass({
  positionalParams: ['userid']
});

export default EmberPieComponent;

/*
import Ember from 'ember';

const FavouriteButtonComponent = Ember.Component.extend({
  	storeName: '',
  	favourited: false,
	willInsertElement: function (){
        this.set('storeName', this.get('targetObject.store'));
        let store = this.get('storeName');
		let _id = this.get('userid');
		let _itemid = this.get('itemid');
		let user = store.peekRecord('user', _id);
		var _that = this;
		user.get('favourites').forEach(function(favourite){
			if(favourite.get('id') === _itemid){
				_that.set('favourited', true);
				return;
			} 
		});

	},
	actions: {
		toggleFavourite: function(){
			let _id = this.get('userid');
			let _itemid = this.get('itemid');
        	let store = this.get('storeName');
	    	let user = store.peekRecord('user', _id);
	    	let item = store.peekRecord('cat-item', _itemid);
			if(this.get('favourited')){
				this.set('favourited', false);
	    		user.get('favourites').removeObject(item);
			} else{				
				this.set('favourited', true);
	    		user.get('favourites').pushObject(item);
			}
    		user.save();
	    }
	}
});

FavouriteButtonComponent.reopenClass({
  positionalParams: ['itemid', 'userid']
});

export default FavouriteButtonComponent;
*/