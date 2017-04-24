import Ember from 'ember';
import moment from 'moment';

const month0 = [
"Finalize ceremony readings",
"Compile run sheet for the day",
"Send run sheet to Venue, bridal party and parents, officiant",
"Decide who will carry the rings",
"Confirm music - pre ceremony, aisle walk, sign register, return aisle",
"Time Aisle song",
"Confirm number of chairs or seats for ceremony",
"Confirm place to walk and stand (inc bridal party)",
"Table and pen for signing",
"Place for gifts",
"Microphone for speeches",
"Confirm place for cake",
"Confirm table layout and seating plan",
"Send confirmed table layout  &  seating plan to Venue",
"Album for guests book",
"Practise first dance",
"Arrange for delivery of flowers on day to each location",
"Arrange for décor delivery and set up times",
"Arrange delivery of cake to venue",
"Send install, removal times, venue contact details to Decorators",
"Send install, removal times, venue contact details to florist",
"Make a honeymoon packing list",
"Buy gifts for your bridal party and MC",
"Place cards for tables",
"Book time for rehersal",
"Create a weekend timeline",
"Book pedicure and manicure",
"Schedule some quiet time before the wedding day/Massage"];

const month1 = ["Choose first dance song",
"Sign up for dance lessons",
"Decide on who is speaking at reception",
"Make time to meet with MC and brief them etc.",
"Advise those required to make a speech",
"Provide a brief for those speaking on content & length",
"Plan the day-after wedding brunch",
"Plan transport for bridal party on the day",
"Wear in wedding shoes",
"Confirm beverages",
"Confirm final numbers with Venue",
"Send Venue confirmed numbers",
"Finalise menu requirements",
"Playlist for dinner and other song requests",
"Buy wedding guest favors",
"List gifts you need to buy",
"Finalise requirements for flowers at ceremony and recepion",
"Buy or make signage for your getaway car",
"Book time in with celebrant to confirm details",
"Finalise the ceremony with celebrant",
"Finalise vows",
"Book rehearsal dinner venue"];

const month2 = ["Buy veil and headpiece",
"Buy shoes",
"Buy all your dress and hair accessories",
"Decide on groom's accessories",
"Save make up and hair ideas",
"Brief make up artist and hairstylist",
"Book Hair trial",
"Book makeup trial",
"Plan transportation for guests if needed",
"Search for party favour ideas",
"Buy reception extras",
"Buy all ceremony extras",
"Organise gift registry",
"Buy grooms accessories",
"Buy under-the-dress essentials and lingerie",
"Finalise or make arrangements for balance payments to vendors"];

const month3 = ["Confirm menu with caterers or venue",
"Arrange where bride & bridesmaids will dress on the day",
"Arrange where groom & groomsmen will dress on the day",
"Order photo booth",
"Book honeymoon (flights and hotels)",
"Check passports etc are in order",
"Book leave ",
"List reception extras to buy",
"List ceremony extras to buy",
"Choose style & flavour of wedding cake and brief confectioner",
"Buy Flower girl outfits",
"Come up with Plan B for alternative weather conditions"];

const month4 = ["Brief Florist",
"Book your band or DJ",
"Pay deposit for Band or DJ",
"Save menswear ideas for groom",
"Purchase  Bridesmaid dresses",
"Buy or rent menswear",
"Save flower girl ideas",
"Send out invitations",
"Book cake baker",
"Pay deposit for cake",
"Book décor vendor",
"Pay deposit for décor vendor",
"Search for groom and groomsmen attire",
"Order wedding bands",
"Insure wedding bands",
"Contact photobooth vendors"];

const month5 = ["Book make up artists and hair stylists",
"Schedule time with bridesmaids for dress search & fittings",
"Contact Band or DJ vendors",
"Search for wedding cake bakers",
"Order your invitations",
"Book your florist",
"Pay deposit for Florist",
"Decide on flower bouquets",
"Decide on flowers for the venue and table",
"Decide on flowers for flower girls",
"Decide on additional flowers for groom and groomsen buttonholes",
"Decide on your ceremony decorations",
"Decide on table decorations & venue décor",
"Source décor items",
"Contact décor vendors with brief",
"Search for wedding band ideas"];

const month6 = ["Search for make up artists and hair stylists",
"Save flower inspiration ideas",
"Save bridesmaid dress inspiration ideas",
"Set a date for wedding dress shopping",
"Buy a wedding dress",
"Schedule dress fittings",
"Contact florists",
"Find wedding cake inspiration & ideas",
"Search for bands & djs",
"Search for wedding officiants",
"Book your officiant",
"Pay deposit for officiant",
"Decide on the MC",
"List potential honeymoon options"];

const month7 = ["Contact photographers & videographers", 
"Research caterers", 
"Contact caterers", 
"Book Photographer & videographer", 
"Pay deposit for Photographer & Videographer", 
"Book caterer", 
"Pay deposit for Caterer", 
"Schedule engagement photos", 
"Search for Bridal Dress vendors and arrange appointments"];

const month8 = [
"Book out accomodation for family and friends attending",
"Book accomodation for the wedding night",
"Send your save-the-dates",
"Search for photographers & videographers",
"Choose Bridal Party"];

const month9 = ["Estimate total guests to attend", 
"Narrow down and choose a few venues to see", 
"Schedule venue tours", 
"Book wedding venue", 
"Pay deposit for venue", 
"Plan a health and fitness regime", 
"Gather postal and email addresses for invitations & save the date", 
"Search designers for wedding stationery and invites", 
"Brief designer on save-the-date design", 
"Order save-the-dates", 
"Book out accomodation for family and friends attending", 
"Book accomodation for the wedding night", 
"Send your save-the-dates", 
"Search for photographers & videographers", 
"Choose Bridal Party"];

const month10 = ["Plan an engagement party", 
"Start venue search", 
"Decide on city & season", 
"Decide on your budget", 
"Begin compiling guest list", 
"Create your wedding budget with the budget calculator", 
"Send engagement announcements", 
"Decide on the theme and colours", 
"Insure engagement ring"]; 

const month11 =  ["Start saving wedding inspiration ideas", 
"Find wedding dress inpiration pics"];

const monthsArr = [month0, month1, month2, month3, month4, month5, month6, month7, month8, month9, month10, month11];

const monthAfter = [
"Review your wedding vendors",
"Send dress and suit to Laundromat",
"Make list of gifts received and who they came from",
"Send thank you cards",
"Change your name",
"Order your photo album",
"Submit your wedding photos to Bloom",
"Apply for a marriage license",
"Name change for Bride ",
"Make list of where name needs to be changed",
"Apply for new passport"];

export default Ember.Route.extend({
	monthKeys: {},
	monthKeysReverse: {},
	model(){		
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('wedding', _id);	
	},
	setupController: function (controller, model) {
		this._super(controller, model);
		let _this = this;
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
	    this.store.findRecord('customer', _id, { reload: true }).then((customer)=>{
	    	// if(customer.get("todoList") === true){
    		if(true){ //Temporarily give all clients access
	    		controller.set('budgetCalcActivated', true);
	    		// alert("TODO LIST LOADED");
	    	}

	    	if(customer.get("budgetCalc") === true){
	    		// alert("BUDGET CALCULATOR LOADED");
	    	}

			if(customer.get("guestListMailer") === true){
	    		// alert("GUEST LIST MAILER LOADED");
	    	}

	    }, function(reason) {
		  // on rejection
		  // alert("You didn't pay for anything, cheapskate");
		});

    if(model.get('weddingDate')) {
    	this.processTodoList(controller, model);
    } else {
    	this.openDatePicker(controller);	    	
    	// Open wedding date picker
    }

	    
	},
	actions: {
		allClick: function(){
			this.controller.set('viewAll', true);
		},
		incompleteClick: function(){
			this.controller.set('viewAll', false);

		},
		checkBox: function(id){
			let task = this.store.peekRecord('task', id);
			let status;
			let completed = task.get('completed');
			if(completed){
				completed = false;
				status = "incomplete.";
			} else {
				completed = true;
				status = "complete.";
			}
			task.set('completed', completed);
			task.save().then(()=>{					
				this.controller.get('notifications').success('Task has been marked as ' + status,{
					autoClear: true
				});							
			});
		},
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
			let _this = this;
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
    					let taskMonth = task.get('month') - 1;
    					if (taskMonth < 0) {
    						taskMonth = "After";
    					}
							let controllerProp = "month" + taskMonth;
			    		let selectedObj = _this.controller.get(controllerProp);
	    				let taskMonths = Ember.get(selectedObj, 'items');
			    		taskMonths.removeObject(task);
							task.deleteRecord();
							task.save().then(()=>{
								_this.controller.get('notifications').info('Task has been deleted.',{
									autoClear: true
								});
    				});
					});

					break;
			}

		},
		okDate: function(){
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('weddingDateId'));

  		if(_modalData.get('mainMessage')) {
	    	let _id = this.get("session").get('currentUser').providerData[0].uid + "";
				let wedding = this.store.peekRecord('wedding', _id);


				wedding.set('weddingDate', _modalData.get('mainMessage'));
				wedding.save().then(()=>{
						this.controller.get('notifications').success('Wedding date has been updated.',{
							autoClear: true
						});
		    		this.processTodoList(this.controller, wedding);
				});
			}

		},
		openDatePickerAction: function() {
    	let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			let wedding = this.store.peekRecord('wedding', _id);
			this.openDatePicker(this.controller, wedding);
		},
    closeDate: function(){
	    	//Clean up dirty attributes
	    	let dateId = this.controller.get("weddingDateId");
	    	let date = this.store.peekRecord('modal-data', dateId);
	    	if(date !== ''){
	    		if(date.get('mainMessage')) {
	    		} else {	    			
						this.controller.get('notifications').error('Pleae select a wedding date. Tasks will not be shown without this.',{
							autoClear: true
						});
	    		}
     			date.deleteRecord();
     		}
     		
	    	this.send('removeModal');
    },
		editTask: function(id){
    	let task = this.store.peekRecord('task', id); 
			this.send('openTodoModal', task);
			this.controller.set('todoEditId', id);
		},
		newTask: function(){
			if(true){
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
			let _this = this;
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			let wedding = this.store.peekRecord('wedding', _id);

			if(this.controller.get('todoEditId')) {
				let taskId = this.controller.get('todoEditId');
				this.controller.set('todoEditId', null);
				let task = this.store.peekRecord('task', taskId);
				let oldTaskMonth = task.get('month');
    		let dateObj = _this.calculateDueDate(task, wedding);
    		task.set('due', dateObj.dueDate);
    		task.set('month', dateObj.dueMonth);
				task.save().then(()=>{
    			//Success notification
    			this.controller.get('notifications').info('Task updated successfully!',{
				    autoClear: true
					});
	    		if(oldTaskMonth !== dateObj.dueMonth) {
	    			console.log("month changed: " + oldTaskMonth + " > " + dateObj.dueMonth);
	    			//Remove from old object
	    			let newMonth = dateObj.dueMonth;
  					oldTaskMonth--;
  					newMonth--;
	    			if(newMonth < 0) {
	    				newMonth = "After";
	    			} 

	    			if(oldTaskMonth < 0) {
	    				oldTaskMonth = "After";
	    			} 


	    			let controllerProp1 = "month" + oldTaskMonth;
		    		let selectedObj1 = _this.controller.get(controllerProp1);
	  				let taskMonths1 = Ember.get(selectedObj1, 'items');
		    		taskMonths1.removeObject(task);

	    			//Add to new object
	    			let controllerProp2 = "month" + newMonth;
		    		let selectedObj2 = _this.controller.get(controllerProp2);
	  				let taskMonths2 = Ember.get(selectedObj2, 'items');
		    		taskMonths2.pushObject(task);
	    		}
    		});  
			} else if (this.controller.get('newTaskId')) {
			    // this.store.findRecord('customer', _id, { reload: true }).then((customer)=>{
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

			    		let dateObj = _this.calculateDueDate(task, wedding);

			    		task.set('due', dateObj.dueDate);
			    		task.set('month', dateObj.dueMonth);
			    		//Save task
			    		task.save().then(()=>{
			    			//Set up hasMany relationship
			    			wedding.get('tasks').pushObject(task);
			    			wedding.save().then(()=>{
			    				//Success notification
			    				this.controller.get('notifications').success('Task created successfully!',{
									    autoClear: true
									});

									let controllerProp = "month" + dateObj.dueMonthStr;
					    		let selectedObj = _this.controller.get(controllerProp);
			    				let taskMonths = Ember.get(selectedObj, 'items');
					    		taskMonths.pushObject(task);
			    			});
			    		});
			    	} else {
	    				this.rejectCustomer();	
			    	}

			    // }, function(reason) {
	    			// this.rejectCustomer();	
				// });
			}

		}
	},
	rejectCustomer:function(){
		this.controller.get('notifications').error('You need to activate this functionality.',{
		    autoClear: true
		});
		this.transitionTo('myaccount.payments');
	},
	calculateDateDiff: function(weddingMonth, weddingY, x){

    	let dateDiff = 0;
    	let setYear = weddingY;
    	if (x  > weddingMonth) { //Previous year
    		dateDiff = 12 + weddingMonth - x;
    		setYear--;
    	} else if(weddingMonth - x === 0) { //After date
    		dateDiff = 0;
    	} else {
    		dateDiff = Math.abs(weddingMonth - x);
    	}
    	let monthStr = "";
    	if(x >= 10){
    		monthStr = x;
    	} else {
    		monthStr = "0" + x;
    	}

    	let dateObj = { 
    		dateDiff: dateDiff, 
    		monthStr: monthStr,
    		setYear: setYear
    	};

    	return dateObj;
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
	},
	openDatePicker: function(controller){
		this._super(controller);
		let _modalData = this.store.createRecord('modal-data', {'mainMessage': '', 'action': 'add'});
   	this.controller.set('weddingDateId', _modalData.get('id'));
  	this.send('showModal', 'modal-date-pick', _modalData);
    
	},
	calculateDueDate: function(task, wedding) {
		let _this = this;
    let weddingMonth = parseInt(moment(wedding.get('weddingDate')).format('MM'));
    let weddingY = parseInt(moment(wedding.get('weddingDate')).format('YYYY'));

		let dateObj;
		let dueDate;
		let dueMonth;		
		let dueMonthStr;
		let monthX = parseInt(moment(task.get('due')).format("MM"));
		dateObj = _this.calculateDateDiff(weddingMonth, weddingY, monthX);

		if(task.get('due')) {
			let isAfter = moment(task.get('due')).isAfter(moment(wedding.get('weddingDate')));
			if(isAfter) {
				dueMonth = -1;
	    	dueDate = moment(task.get('due'));
				dueMonthStr = "After";
			} else {			    		
	    	dueDate = moment(task.get('due'));
	    	let monthS = moment(task.get('due')).format("MMMM");
	    	for(var i = 0; i < 12; i++){
	    		let currentIndex = this.controller.get("month" + i);
	    		let strTest = currentIndex.get('title');
	    		if(strTest == monthS) { // jshint ignore:line
	    			dueMonth = currentIndex.get('index') + 1;
	    			dueMonthStr = parseInt(dueMonth) - 1;
	    			i = 12;
	    		}
	    	}
			}
    	// m = getMString(dueMonth);
		} else {
			let currentMonth = this.controller.get('selectedMonth');
			let selectedM = this.controller.get(currentMonth);
			dueMonth = selectedM.get('index') + 1;
			dueDate = moment();
			dueMonthStr = parseInt(dueMonth) - 1;	
		}

		let obj = {
			dueDate: dueDate,
			dueMonth: dueMonth,
			dueMonthStr: dueMonthStr
		};

		return obj;
	},
	getMonthName: function(monthStr) {
		let monthKeys = this.get('monthKeys');
		let xVal = parseInt(monthStr);
		xVal--;
		let monthString = monthKeys.get(xVal + "");
		return monthString;
	},
	processTodoList: function (controller, model) {
		this._super(controller, model);
		let _this = this;
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		_this.controller.set('isGenerating', true);
   	var promisesArr = [];
   	var savesArr = [];

    /* 
    		- Get current month & wedding month
    		- Set up all months based on this
    */

    let currentD = parseInt(moment().format('YYYYMM'));
    let currentMonth = parseInt(moment().format('MM'));
    let weddingD = parseInt(moment(model.get('weddingDate')).format('YYYYMM'));
    let weddingMonth = parseInt(moment(model.get('weddingDate')).format('MM'));
    let weddingY = parseInt(moment(model.get('weddingDate')).format('YYYY'));
    let currentY = parseInt(moment().format('YYYY'));
		    
		    if(model.get('weddingDateChanged')) {
		    	//If wedding date has changed: run through all tasks
		    	// - calculate date diff
		    	// - Update month and due (if made by Bloom)
		    	let oldDate = model.get('weddingDateChanged');
		    	let newDate = model.get('weddingDate');
		    	let monthDiff = moment(oldDate);
		    	var duration = moment.duration(moment(newDate).diff(moment(oldDate)));
					var months = Math.trunc(duration.asMonths());
					var years = Math.trunc(duration.asYears());
					createMonths(true).then(()=> {
						shuffleMonths(months, years).then(()=>{
							model.set('weddingDateChanged', null);
							model.save();			
		    			arrangeTasks();
						});
					});
					// alert(months);
		    } else {
		    	if(model.get('tasksGenerated')) {
		    		createMonths(false).then(()=>{arrangeTasks();});
		    	} else {
		    		// console.log("Generating Tasks");
		    		createMonths(false).then(()=>{
		    			generateTasks().then(()=>{		    				
		    				arrangeTasks();
		    			});
		    		});
		    	}
		    }

		    function shuffleMonths(months, years) {
		    	return new Promise (function(resolve, reject) {
		    		model.get('tasks').then((tasks)=>{
		    			let len = tasks.length;
		    			tasks.forEach(function(task, currentIndex) {
		    				if (task.get('createdBy') === "Bloom") {
		    					let due = task.get('due');
		    					let newDue;
		    					if(months > 0) { //Add
		    						newDue = moment(due).add(months, "months");
		    					} else if (months < 0) { //Subtract
		    						let monthsAbs = Math.abs(months);
		    						newDue = moment(due).subtract(monthsAbs, "months");		  						
		    					}

		    					if (years > 0) { //Add
		    						newDue = moment(newDue).add(years, "years");		    						
		    					} else if (years < 0) {  // Subtract
		    						let yearsAbs = Math.abs(years);
		    						newDue = moment(newDue).subtract(yearsAbs, "years");   
		    					} 

		    					task.set('due', newDue);

				 					/* jshint ignore:start */
			    				let promise = new Promise(function(resolve, reject) {
				    					task.save().then(()=>{
				    						resolve();
				    					});
				    			});
				    			
				    			savesArr.pushObject(promise);

				    			if(currentIndex + 1 >= len) {
						    		Promise.all(savesArr).then(() => {
					    				resolve();
										});	
				    			}
			    				/* jshint ignore:end */
		    				} else {
				    			if(currentIndex + 1 >= len) {
						    		Promise.all(savesArr).then(() => {
					    				resolve();
										});	
				    			}		    					
		    				}
		    			});
		    		});
		    	});
		    }

		    function generateTasks() {		    	
		    	return new Promise (function(resolve, reject) {

		    		//Generate Tasks
		    		for (var i = 0; i < monthsArr.length; i++){ 
		    			let x = i + 1;
		    			let dateObj = _this.calculateDateDiff(weddingMonth, weddingY, x);
							let monthName = _this.getMonthName(dateObj.monthStr);
				    	let dueDate = moment("01"+monthName + "" + dateObj.setYear, "DDMMMMYYYY");
		    			for(var j = 0; j < monthsArr[i].length; j++) {
		    				let taskVal = monthsArr[i][j];
		    				// console.log(taskVal);
		    				let task = _this.store.createRecord('task', {
		    					title: taskVal,
		    					due: dueDate,
		    					createdOn: moment().unix()*1000,
		    					createdBy: "Bloom",
		    					completed: false,
		    					month: parseInt(dateObj.monthStr)
		    				});
		    				model.get('tasks').pushObject(task);

		 						/* jshint ignore:start */
		    				let promise = new Promise(function(resolve, reject) {
			    					task.save().then(()=>{
			    						resolve();
			    					});
			    				});
		    				
		    				promisesArr.pushObject(promise);
		 						/* jshint ignore:end */
		    			}
		    		}

		    		let dateObj = {
		    			dateDiff: -1,
		    			setYear: weddingY
		    		};
		    		let dueDateAfter = moment(model.get('weddingDate')).add(2, 'months');

		    		for (var k = 0; k < monthAfter.length; k++) {
		    			let taskVal = monthAfter[k];
		    			let task = _this.store.createRecord("task", {
		    					title: taskVal,
		    					due: dueDateAfter,
		    					createdOn: moment().unix()*1000,
		    					createdBy: _id,
		    					completed: false,
		    					month: -1    				
		    			});
	    				model.get('tasks').pushObject(task);

		 					/* jshint ignore:start */
	    				let promise = new Promise(function(resolve, reject) {
		    					task.save().then(()=>{
		    						resolve();
		    					});
		    				});
		    			
		    			promisesArr.pushObject(promise);
	    				/* jshint ignore:end */
		    		}

		    		Promise.all(promisesArr).then(() => {
		    			model.set('tasksGenerated', true);
		    			model.save().then(()=>{
		    				resolve();
		    			});
						});	

		    	});						
		    }

		    function createMonths(dateChanged) {
		    	return new Promise(function(resolve, reject){

		    		if(dateChanged) {
							_this.controller.set('monthArr', []);
		    		} else {
		    			if(_this.controller.get('monthArrCreated')) {
		    				resolve();
		    				return;
		    			}
		    		}

					let monthKeys = Ember.Object.create({

					});
					_this.set('monthKeys', monthKeys);

					let monthKeysReverse = Ember.Object.create({

					});
					_this.set('monthKeysReverse', monthKeysReverse);
			    for(var i = 12; i >= 1; i--) {
						
						let dateObj = _this.calculateDateDiff(weddingMonth, weddingY, i);
						let mStr = i;
						if(i < 10) {
							mStr = "0" + i;
						}
			    	let monthName = moment(mStr, "MM").format("MMMM");
			    	let controllerProp = "month" + dateObj.dateDiff;
			    	let isSelected = false;
			    	let isPast = false;
			    	if(i  < currentMonth && dateObj.setYear <= currentY) {
			    		isPast = true;
			    	} else if (i  === currentMonth && dateObj.setYear === currentY) {
			    		isSelected = true;
			    		_this.controller.set('selectedMonth', controllerProp);
			    	}
			    	let obj = Ember.Object.create({ 
								title: monthName,
								selected: isSelected,
								past: isPast,
								items: [],
								year: dateObj.setYear,
								index: dateObj.dateDiff
						});

						monthKeys.set(dateObj.dateDiff + "", monthName);
						monthKeysReverse.set(monthName + "", dateObj.dateDiff);
						let monthArr = _this.controller.get("monthArr");
						monthArr.pushObject(obj);
						_this.controller.set("monthArr", monthArr);
						_this.controller.set(controllerProp, obj);
			    }

			    let isSelected = false;
			    if(parseInt(moment()) > parseInt(moment(model.get('weddingDate')))) {
			    	isSelected = true;
			    }

			    let monthAfter = Ember.Object.create({ 
								title: "After",
								selected: isSelected,
								past: false,
								items: [],
								year: weddingY,
								index: -1
						});
						_this.controller.set('monthAfter', monthAfter);
						_this.controller.set('monthArrCreated', true);
						resolve();

		    	});
				}

	 			function arrangeTasks () {


			    //Assign all tasks to month objects
			    model.get('tasks').then((tasks)=>{
			    	let count = 0;
			    	let total = tasks.length;
			    	let promise = new Promise (function(resolve, reject) {
				    	tasks.forEach(function(task) {
				    		let month = _this.controller.get('selectedMonth');
				    		let year = currentY;
				    		let monthStr = month;
				    		// let monthDiff = 0;
				    		if(task.get('month')) {
				    			month = parseInt(task.get('month'));
				    			if (month < 0) {
				    				// monthDiff = -1;
				    				monthStr = "monthAfter";
				    			} else {
				    			  // monthDiff = 12 - month;
				    			  let monObj = _this.calculateDateDiff(weddingMonth, weddingY, month); //parseInt(moment(task.get('due')).format("MM"))-1;
				    			  let monthNum = parseInt(monObj.monthStr)-1;
				    				monthStr = "month" + monthNum;		    				
				    			}

				    			year = parseInt(moment(task.get('due')).format("YYYY"));
				    		}

				    		let controllerProp = monthStr;
				    		let selectedObj = _this.controller.get(controllerProp);
				    		let taskMonths = Ember.get(selectedObj, 'items');
				    		taskMonths.pushObject(task);
				    		count++;
				    		if(total === count) {
				    			resolve();
				    		}

				    	});

			    	});

			    	promise.then(()=>{
			    		let obj = _this.controller.get('monthArr');
			    		let newObj = _this.convertJSONtoArray(obj);
			    		function compare(a,b) {
							  if (a.index < b.index){
							    return -1;
							  }
							  if (a.index > b.index){
							    return 1;
							  }
							  return 0;
							}

							newObj.sort(compare);
							newObj.reverse();
							_this.controller.set('isGenerating', false);
			    		_this.controller.set('monthsArr', newObj);
							_this.controller.set('refresh', false);
							Ember.run.next(function () {
					        _this.controller.set('refresh', true);
					    });

			    	});


			    });
			  }

 				
 			}
        
});