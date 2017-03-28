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
	accomodationForBridalParty: "Accommodation for Bridal Party"
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
					'categoryApparel': 0,
					'categoryPeople': 0,
					'categoryEvent': 0,
					'categoryPlaces': 0,
					'categoryAdditional': 0
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
		let _this = this;
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
	    	this.store.findRecord('wedding', _id). then((wedding)=> {
	    		wedding.set('hasBudget', true);
	    		wedding.save().then(()=>{
			    	_this.set('createdBudget', 0);
			    	_this.refresh();
	    		});
	    	});
	    	// this.store.findRecord('budget', _id, { reload: true }).then(()=>{
	    	// 	_this.convertAllCategories();
	    	// });
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
			let category = budget.get('category');

			// deposit + booked < estimate

			if(estimate >= 0 && booked >= 0 && deposit >= 0){
		    	let _budget = this.store.peekRecord('budget', _id);
		    	let selectedCategory = _budget.get(category);
		    	let selectedObject = Ember.get(selectedCategory, budget.get('_id'));
		    	let balance = 0;

				if(estimate >= booked) {
			    	balance = estimate - booked;
			    	//save this later			
				} else {
					estimate = booked;
					budget.set('estimate', estimate);

		      		this.controller.get('notifications').warning('Estimated budget has been increased to match used budget',{
		                 autoClear: true
		            });			
				}
			    
			    this.recalculateBudget(_budget, budget);
		    	Ember.set(selectedObject, 'deposit', deposit);
		    	Ember.set(selectedObject, 'estimate', estimate);
		    	Ember.set(selectedObject, 'booked', booked);
		    	Ember.set(selectedObject, 'balance', balance);

			} else {
		    	this.controller.get('notifications').error('Negative numbers are invalid!',{
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
	    },
	    saveNewTotal: function(){
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
	    	let budget = this.store.peekRecord('budget', _id);
	    	let newTotal = parseInt(this.controller.get('total'));
	    	let unallocated = parseInt(budget.get('unallocated'));
	    	let total = parseInt(budget.get('total'));
	    	if(newTotal >= 0){
	    		//Ensure new total isn't squelching unallocated below 0
	    		let deltaTotal = newTotal - total;
	    		let newUnallocated = unallocated + deltaTotal;
	    		if (newUnallocated >= 0) { 
	    			//update
	    			budget.set('unallocated', newUnallocated);
	    			budget.set('total', newTotal);
	    			budget.save().then(()=>{
	    				this.controller.set('total', undefined);
						this.refreshBudgetWidget();
				    	this.controller.get('notifications').success('Budget total has been updated!',{
			                autoClear: true
			            });  			            
						this.updateWedding();      				
	    			});
	    		} else {
	    			let excess = 0 - newUnallocated;
			    	this.controller.get('notifications').error('New total is is too low!' + '\nPlease increase by at least ' + excess,{
		                autoClear: true
		            });		    			
	    		}

	    	} else {
		    	this.controller.get('notifications').error('Negative numbers are invalid!',{
	                autoClear: true
	            });			    		
	    	}

	    }
	},
	recalculateBudget: function(oldBudget, newBudget) {
		//NEW
		let estimate = parseInt(newBudget.get('estimate'));
		let booked = parseInt(newBudget.get('booked'));
		let category = newBudget.get('category');
		let id = newBudget.get('_id');

		//OLD
    	let selectedCategory = oldBudget.get(category);
    	let oldObject = Ember.get(selectedCategory, id);
		let oldEstimate = Ember.get(oldObject, 'estimate');
		let oldBooked = parseInt(Ember.get(oldObject, 'booked'));

		let deltaBooked = oldBooked - booked;
		let deltaEstimated = oldEstimate - estimate;
			
		//Update
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
    	let _budget = this.store.peekRecord('budget', _id);
    	let selectedTotals = _budget.get('categoryTotals');
    	let _oldBooked = Ember.get(selectedTotals, category);
    	let _oldEstimate = parseInt(_budget.get('total'));
    	let unallocated = parseInt(_budget.get('unallocated'));
    	// if true, then total needs to be increased
    	let newUnallocated = unallocated + deltaEstimated;
    	if(newUnallocated < 0) {
    		let newEstimate = _oldEstimate - newUnallocated;
    		_budget.set('total', newEstimate);
    		_budget.set('unallocated', 0);   		
    	} else {
    		_budget.set('unallocated', newUnallocated);
    	}

    	let newBooked = _oldBooked - deltaBooked;
    	Ember.set(selectedTotals, category, newBooked);	
    	//calculate total used budget again
    	this.recalculateTotalUsed(_budget);
	},
	recalculateTotalUsed: function(budget){
    	let selectedTotals = budget.get('categoryTotals');
    	// let total = budget.get('total');
    	let used = 0;

    	for (var key in BUDGET_CATEGORIES) {
    		used+= Ember.get(selectedTotals, key);
    	}
    	budget.set('used', used);
    	// budget.set('unallocated', total - used);

		budget.save().then(()=>{
			this.refreshBudgetWidget();
			this.convertAllCategories(); // Convert only category in future
	    	this.controller.get('notifications').success('Budget has been updated!',{
                autoClear: true
            });  
			this.updateWedding();          
    	});	
	},
	updateWedding: function(){
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
        let wedding = this.store.peekRecord('wedding', _id);
    	if(wedding.get('hasBudget')){

    	} else {			            		
        	wedding.set('hasBudget', true);
        	wedding.save();
    	}  
	},
	refreshBudgetWidget: function(){
		const _this = this;
		this.controller.set('refresh', false);
		Ember.run.next(function () {
	        _this.controller.set('refresh', true);
	    });
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

		//Convert each category
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