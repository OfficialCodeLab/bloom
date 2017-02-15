import Ember from 'ember';
import moment from 'moment';

// import ENV from '../../../config/environment';
// const ref = new window.Firebase(ENV.firebaseURL);

const BUDGET_APPAREL = {
	//Apparel:
	weddingDress: "Wedding Dress",
	groomSuit: "Groom Suit",
	hairAndMakeup: "Hair and Makeup",
	bridesmaidDresses: "BridesMaid Dresses",
	groomsmenSuits: "Groomsmen Suits",
	weddingRings: "Wedding Rings",
	shoesAndAccessories: "Shoes And Accessories"
};

const BUDGET_PEOPLE = {
	//People:
	photographer: "Photographer",
	videographer: "Videographer",
	officiant: "Officiant",
	bandOrDJ: "Band / DJ",
	florist: "Florist"
};

const BUDGET_EVENT = {
	//Event:
	foodAndDrinks: "Food and Drinks",
	decor: "Décor",
	cake: "Cake",
	weddingFavours: "Wedding Favours",
	bridalPartyGifts: "Bridal Party Gifts",
	addedExtras: "Added Extras"
};

const BUDGET_PLACES = {
	//Places
	venue: "Venue",
	weddingNightHotel: "Wedding Night Hotel",
	accomodationForBridalParty: "Accomodation for Bridal Party"
};

const BUDGET_ADDITIONAL = {
	//Additional
	weddingStationery: "Wedding Stationery",
	photobooth: "Photobooth",
	honeymoon: "Honeymoon",
	insurance: "Insurance"
};

export default Ember.Route.extend({
	createdBudget: 0,
	firebase: Ember.inject.service(),
	model(){		
		
    	let _id = this.get("session").get('currentUser').providerData[0].uid + "";

    	//Check the local store first for record of the budget

		return Ember.RSVP.hash({
	    	budget: this.store.findRecord('budget', _id, { reload: true }).then((_budget)=>{
	    		return _budget;
	    	}, () => {
				//Need to create Record
				this.set("createdBudget", 1);
				return this.store.createRecord('budget', {
					id: _id,
					total: 0,
					used: 0,
					moneyFromFam: 0,
					savedSoFar: 0,
					leftToSave: 0
				});

				//Run through hashtables and set up objects for each attribute of Budget model
				//let _apparel = [];
				// for (var key in BUDGET_APPAREL) {
				// 	let obj = Ember.Object.create({ 
				// 		name: BUDGET_APPAREL[key],
				// 		booked: 0,
				// 		estimate: 0,
				// 		deposit: 0,
				// 		balance: 0,
				// 		category: "Apparel"
				// 	});
				// 	alert("STILL GOIN BOIS");
				// 	var ref = new Firebase("https://pear-server.firebaseio.com/budget/categoryApparel/"+key);
				// 	var newChildRef = ref.push();
				// 	newChildRef.set(obj);
					
				// 	// newBudget.set(key, obj);
				// }



		  //       return EmberFire.ObjectArray.create({ ref: ref.child('menus')});
				// alert("WE MADE IT BOIS");
				// newBudget.set('categoryApparel', _apparel);

				// let _event = [];
				// for (key in BUDGET_EVENT) {
				// 	let obj = { 
				// 		name: BUDGET_EVENT[key],
				// 		booked: 0,
				// 		estimate: 0,
				// 		deposit: 0,
				// 		balance: 0,
				// 		category: "Event"
				// 	};
				// 	_event.pushObject(obj);
				// }
				// newBudget.set('categoryEvent', _event);

				// let _people = [];
				// for (key in BUDGET_PEOPLE) {
				// 	let obj = { 
				// 		name: BUDGET_PEOPLE[key],
				// 		booked: 0,
				// 		estimate: 0,
				// 		deposit: 0,
				// 		balance: 0,
				// 		category: "People"
				// 	};
				// 	_people.pushObject(obj);
				// }
				// newBudget.set('categoryPeople', _people);

				// let _places = [];
				// for (key in BUDGET_PLACES) {
				// 	let obj = { 
				// 		name: BUDGET_PLACES[key],
				// 		booked: 0,
				// 		estimate: 0,
				// 		deposit: 0,
				// 		balance: 0,
				// 		category: "Places"
				// 	};
				// 	_places.pushObject(obj);
				// }
				// newBudget.set('categoryPlaces', _places);

				// let _additional = [];
				// for (key in BUDGET_ADDITIONAL) {
				// 	let obj = { 
				// 		id: key,
				// 		name: BUDGET_ADDITIONAL[key],
				// 		booked: 0,
				// 		estimate: 0,
				// 		deposit: 0,
				// 		balance: 0,
				// 		category: "Additional"
				// 	};
				// 	_additional.pushObject(obj);
				// }
				// newBudget.set('categoryAdditional', _additional);
	     	}).catch((err)=>{})
	    });
	},
	setupController: function (controller, model) {
		this._super(controller, model);
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		controller.set('budget', model.budget);
		model.budget.save();
		if(false) {
		let ref = this.get('firebase');
		let _ref = ref.child('budgets').child(_id);
		// let ref = firebase.database().ref('budget');
    	let newBudget = this.store.peekRecord('budget', _id);
    	// newBudget.save().then(()=>{
	        for (var key in BUDGET_APPAREL) {
				let obj = Ember.Object.create({ 
					name: BUDGET_APPAREL[key],
					booked: 0,
					estimate: 0,
					deposit: 0,
					balance: 0,
					category: "Apparel"
				});
				var newChildRef = _ref.push();
				newChildRef.set(obj);

				
				// newBudget.set(key, obj);
			}
		}
    	// });


	// controller.set('budgetItems', budgetItems);
	    this.store.findRecord('customer', _id, { reload: true }).then((customer)=>{
	    	if(customer.get("todoList") === true){
	    		// alert("TODO LIST LOADED");
	    	}
	    	// if(customer.get("budgetCalc") === true){
    		if(true){ //Temporarily give all clients access
	    		controller.set('budgetCalcActivated', true);
	    	}

			if(customer.get("guestListMailer") === true){
	    		// alert("GUEST LIST MAILER LOADED");
	    	}

	    }, function(reason) {
		  // on rejections
		  // alert("You didn't pay for anything, cheapskate");
		});
	},
	actions: {
		destroyTask: function(id){
			let _modalData;
			this.controller.set('taskId', id);
			if(this.controller.get('modalDataId')){
				_modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
				_modalData.set('mainMessage', 'Do you want to remove this task?');	
				_modalData.set('action', 'delete');	
            	this.send('showModal', 'modal-confirm', _modalData);	            	
            } else {
		    	let _modalData = this.store.createRecord('modal-data', {'mainMessage': 'Do you want to remove this task?', 'action': 'delete'});
		     	this.controller.set('modalDataId', _modalData.get('id'));
            	this.send('showModal', 'modal-confirm', _modalData);
            } 

		},
		ok: function() {
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			switch(_modalData.get('action')) {
				case 'delete':					
					
			    	let _id = this.get("session").get('currentUser').providerData[0].uid + "";
					let wedding = this.store.peekRecord('wedding', _id);
					let taskId = this.controller.get('taskId');
					let task = this.store.peekRecord('task', taskId);
					this.controller.set('taskId', null);
					//Unassign task from wedding
    				wedding.get('tasks').removeObject(task);
    				wedding.save().then(()=>{
    					//Destroy the record
						task.deleteRecord();
						task.save().then(()=>{
							this.controller.get('notifications').info('Task has been deleted.',{
								autoClear: true
							});
	    				});
					});

					break;
			}

		},
		editTask: function(id){
    		let task = this.store.peekRecord('task', id); 
			this.send('openTodoModal', task);
			this.controller.set('todoEditId', id);
		},
		newTask: function(){
			if(this.controller.get('todoListActivated')){
				let task = this.store.createRecord('task');
		    	this.send('openTodoModal', task);
				this.controller.set('newTaskId', task.get('id'));
			} else {
				//Double check
				let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			    this.store.findRecord('customer', _id, { reload: true }).then((customer)=>{
			    	// if(customer.get("todoList") === true){	
			    	if(true){ //Temporarily give all clients access
						let task = this.store.createRecord('task');
				    	this.send('openTodoModal', task);
						this.controller.set('newTaskId', task.get('id'));		    	
			    	} else {
	    				this.rejectCustomer();	
			    	}
			    }, function(reason) {
	    			this.rejectCustomer();	
				});			
			}
	    	// this.controller.set('taskCurrent', task);
			// alert(this.controller.get('newTaskId'));
		},
		saveTodo: function(){
			if(this.controller.get('todoEditId')) {
				let taskId = this.controller.get('todoEditId');
				this.controller.set('todoEditId', null);
				let task = this.store.peekRecord('task', taskId);
				task.save().then(()=>{
	    			//Success notification
	    			this.controller.get('notifications').info('Task updated successfully!',{
					    autoClear: true
					});
	    		});  
			} else if (this.controller.get('newTaskId')) {
				let _id = this.get("session").get('currentUser').providerData[0].uid + "";

			    this.store.findRecord('customer', _id, { reload: true }).then((customer)=>{
			    	// if(customer.get("todoList") === true){			
			    	if(true){  //Temporarily give all clients access   		
						let taskId = this.controller.get('newTaskId');
						this.controller.set('newTaskId', null);
						let task = this.store.peekRecord('task', taskId);
						// this.controller.set('isTodoSubmitted', true);
						let wedding = this.store.peekRecord('wedding', _id);
				    	//Set up creation date to confirm task has now been created
			    		let createdOn = moment().unix()*1000;
			    		task.set('createdOn', createdOn);
			    		//Set up belongsTo relationship
			    		task.set('createdBy', _id);
			    		//Save task
			    		task.save().then(()=>{
			    			//Set up hasMany relationship
			    			wedding.get('tasks').pushObject(task);
			    			wedding.save().then(()=>{
			    				//Success notification
			    				this.controller.get('notifications').success('Task created successfully!',{
								    autoClear: true
								});
			    			});
			    		});
			    	} else {
	    				this.rejectCustomer();	
			    	}

			    }, function(reason) {
	    			this.rejectCustomer();	
				});
			}

		}
	},
	rejectCustomer:function(){
		this.controller.get('notifications').error('You need to activate this functionality.',{
		    autoClear: true
		});
		this.transitionTo('myaccount.payments');
	}
        
});