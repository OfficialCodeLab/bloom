import Ember from 'ember';
import moment from 'moment';

//Apparel
const BUDGET_APPAREL = {
	weddingDress: "Wedding Dress",
	groomSuit: "Groom Suit",
	hairAndMakeup: "Hair and Makeup",
	bridesmaidDresses: "Bridesmaid Dresses",
	groomsmenSuits: "Groomsmen Suits",
	weddingRings: "Wedding Rings",
	shoesAndAccessories: "Shoes And Accessories"
};

//People:
const BUDGET_PEOPLE = {
	photographer: "Photographer",
	videographer: "Videographer",
	officiant: "Officiant",
	bandOrDJ: "Band / DJ",
	florist: "Florist"
};

//Event
const BUDGET_EVENT = {
	catering: "Catering",
	decor: "Décor",
	cake: "Cake",
	weddingFavours: "Wedding Favours",
	bridalPartyGifts: "Bridal Party Gifts",
	addedExtras: "Added Extras"
};

//Places
const BUDGET_PLACES = {
	venue: "Venue",
	weddingNightHotel: "Wedding Night Hotel",
	accomodationForBridalParty: "Accomodation for Bridal Party"
};

//Additional
const BUDGET_ADDITIONAL = {
	weddingStationery: "Wedding Stationery",
	photobooth: "Photobooth",
	honeymoon: "Honeymoon",
	insurance: "Insurance"
};

//All categories
const BUDGET_CATEGORIES = {
	'categoryApparel': BUDGET_APPAREL,
	'categoryPeople': BUDGET_PEOPLE,
	'categoryEvent': BUDGET_EVENT,
	'categoryPlaces': BUDGET_PLACES,
	'categoryAdditional': BUDGET_ADDITIONAL
};

export default Ember.Route.extend({
	createdBudget: 0,
	firebase: Ember.inject.service(),
	model(){		
		
    	let _id = this.get("session").get('currentUser').providerData[0].uid + "";

		return Ember.RSVP.hash({
	    	budget: this.store.findRecord('budget', _id, { reload: true }).then((_budget)=>{
	    		return _budget;
	    	}, () => {
				//Need to create Record
				this.set("createdBudget", 1);
				let totalsObj = {					
					'apparel': 0,
					'people': 0,
					'event': 0,
					'places': 0,
					'additional': 0
				};
				let newBudget = this.store.createRecord('budget', {
					id: _id,
					total: 0,
					used: 0,
					moneyFromFam: 0,
					savedSoFar: 0,
					leftToSave: 0,
					unallocated: 0,
					categoryApparel: {},
					categoryEvent: {},
					categoryPeople: {},
					categoryPlaces: {},
					categoryAdditional: {},
					categoryTotals: totalsObj
				});

				newBudget.save().then(()=>{
					return newBudget;
				}).catch((e) => {
				    console.log(e.errors);
				});
	     	}).catch((err)=>{})
	    });
	},
	setupController: function (controller, model) {
		this._super(controller, model);
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		controller.set('budget', model.budget);
		if(this.get("createdBudget") === 1) {
			let ref = this.get('firebase');
			let _ref = ref.child('budgets').child(_id);
	    	let newBudget = this.store.peekRecord('budget', _id);
	    	for (var key in BUDGET_CATEGORIES) {
	    		var childRef = key;
	    		var __ref = _ref.child(childRef);
		        for (var k in BUDGET_CATEGORIES[key]) {
					let obj = Ember.Object.create({ 
						name: BUDGET_CATEGORIES[key][k],
						booked: 0,
						estimate: 0,
						deposit: 0,
						balance: 0
					});
					var newChildRef = __ref.push();
					newChildRef.set(obj);
				}	    		
	    	}
	    	this.store.findRecord('budget', _id, { reload: true }).then(()=>{
	    		this.convertAllCategories();
	    	});
		}
		else {
			this.convertAllCategories();
		}

		//Check store for customer
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
		//TODO:
			// - check for access rights
			// - graph updating
			// - quickly entering a budget total?

		openBudgetModal: function(id, obj, category){
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			let budget = this.store.createRecord('budget-modal', {				
				_id: id,
				name: Ember.get(obj, 'name'),
				balance: Ember.get(obj, 'balance'),
				booked: Ember.get(obj, 'booked'),
				estimate: Ember.get(obj, 'estimate'),
				deposit: Ember.get(obj, 'deposit'),
				category: category
			});
			this.controller.set('selectedBudgetId', budget.id);
	    	this.send('showModal', 'modal-budget', budget);
	    },
		closeBudgetModal: function(){
	    	let budgetId = this.controller.get('selectedBudgetId');
			let budget = this.store.peekRecord('budget-modal', budgetId);
	    	budget.deleteRecord();
			this.set('isSubmitted', false);
	    	this.send('removeModal');
		},
	    submitBudget: function(){
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
	    	let budgetId = this.controller.get('selectedBudgetId');
			let budget = this.store.peekRecord('budget-modal', budgetId);
			let deposit = parseInt(budget.get('deposit'));
			let estimate = parseInt(budget.get('estimate'));
			let booked = parseInt(budget.get('booked'));

			// deposit + booked < estimate

			if(estimate > deposit + booked) {
		    	let balance = estimate - deposit - booked;
		    	let _budget = this.store.peekRecord('budget', _id);
		    	let selectedCategory = _budget.get(budget.get('category'));
		    	let selectedObject = Ember.get(selectedCategory, budget.get('_id'));
		    	console.log(selectedObject);
		    	Ember.set(selectedObject, 'deposit', deposit);
		    	Ember.set(selectedObject, 'estimate', estimate);
		    	Ember.set(selectedObject, 'booked', booked);
		    	Ember.set(selectedObject, 'balance', balance);
		    	_budget.save().then(()=>{
			    	this.controller.get('notifications').success('Budget has been updated!',{
		                autoClear: true
		            });  
		    	});				
			} else {		
		    	this.controller.get('notifications').error('Total budget cannot be less than used budget!',{
	                autoClear: true
	            });					
			}
	    },
	    selectBudget: function(id, cat){
	    	// alert('Selected: ' + id + "\nCategory: " + cat);
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
	    	let budget = this.store.peekRecord('budget', _id);
	    	let selectedCategory = Ember.get(budget, cat);
	    	let selectedObject = Ember.get(selectedCategory, id);
	    	this.send('openBudgetModal', id, selectedObject, cat);
	    }
	},
	rejectCustomer:function(){
		this.controller.get('notifications').error('You need to activate this functionality.',{
		    autoClear: true
		});
		this.transitionTo('myaccount.payments');
	},
	convertAllCategories: function (){
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		let budget = this.store.peekRecord('budget', _id);

		//Convery each category
		let budgetApparel = this.convertJSONtoArray(budget.get('categoryApparel'));
		this.controller.set('budgetApparel', budgetApparel);

		let budgetPeople = this.convertJSONtoArray(budget.get('categoryPeople'));
		this.controller.set('budgetPeople', budgetPeople);


		let budgetEvent = this.convertJSONtoArray(budget.get('categoryEvent'));
		this.controller.set('budgetEvent', budgetEvent);


		let budgetPlaces = this.convertJSONtoArray(budget.get('categoryPlaces'));
		this.controller.set('budgetPlaces', budgetPlaces);


		let budgetAdditional = this.convertJSONtoArray(budget.get('categoryAdditional'));
		this.controller.set('budgetAdditional', budgetAdditional);
	},
	convertJSONtoArray: function(obj) {
		let objArr = [];
		for (var key in obj){
			if (obj.hasOwnProperty(key)) {
				obj[key]['id'] = key;
                objArr.pushObject(obj[key]);
            }
		}

		return objArr;
	}
        
});