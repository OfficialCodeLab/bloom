import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
	cdata: null,
	isSubmitted: false,
	model(){
		let _id = this.get("currentUser.uid") + "";
		return this.store.findRecord('wedding', _id);
	},
	setupController: function (controller, model) {
		this._super(controller, model);
		let weddingDate = model.get('weddingDate');
	  	controller.set('selectedDate', weddingDate);
		this.dateDiff(controller.get('computedSelected'), controller.get('dateCurrent'), controller);
	    // this.store.find('topVendor', 'topvendor').then((vendor)=> {
	    // 	let vendors = vendor.get('vendors');
	    // 	let numberOne = vendors.objectAt(0).id;
	    // 	this.store.find('vendor', numberOne).then((v)=>{
	    // 		controller.set('topVendor', v);
	    // 	});
	    // });
		let _id = this.get("currentUser.uid") + "";
	    let user = this.store.peekRecord('user', _id);
	    controller.set('name', user.get('name'));
	    controller.set('surname', user.get('surname'));
	    controller.set('spouse', user.get('spouse'));
	    controller.set('email', user.get('email'));
	    controller.set('cell', user.get('cell'));
	    controller.set('city', user.get('city'));
	    controller.set('birthday', user.get('birthday'));
	    this.store.find('customer', _id).then((customer)=>{
	    	if(customer.get("todoList") === true){
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
	},
	dateDiff: function(d1, d2, controller){
		let d3 = moment(d1).unix()*1000;
		let d4 = moment(d2).unix()*1000;
		let dayStr = 'Days to go';
		// let preStr = 'Your wedding is in ';
		let days = Math.floor(( d3 - d4 ) / 86400000) + 1;
		if(days === 1){
			dayStr = 'Day to go';
		} else if (days === 0 ) {
			// preStr = 'Your wedding is ';
			days = 'Today!';
			dayStr = "is your wedding day!";
		} else if (days <= -1) {
			// preStr = 'Your wedding was ';
			days = Math.sqrt(days*days);
			dayStr = 'Days ago';
		}
		// console.log(moment);
		//  // let days = Math.floor(( d1 - d2 ) / 86400000);
		 // let days = d1.diff(d2, 'days');
		 if(controller){
		 	controller.set('computedFromNow', days);
		 	controller.set('daysString', dayStr);
		 	controller.set('daysNum', days);
		 } else {
		 	this.controller.set('computedFromNow', days);
		 	this.controller.set('daysString', dayStr);
		 	this.controller.set('daysNum', days);
		 }
	},
	actions: {
		startPieChart(){



			/*
			if(_name !== '' && _name !== " "){
				this.controller.set('responseMessage', "");
				console.log("SEARCHING FOR: " + _name);
				let searchResults = [];
				this.controller.set('searching', true);
				this.store.query('user',  {}).then((users) =>{
				  // Do something with `peters`
				  	users.forEach(function(user){
						let fullname = user.get('name') + " " + user.get('surname');
						if(~fullname.toLowerCase().indexOf(_name)){
							searchResults.pushObject({
								name: fullname,
								id: user.get("id")
							});
							console.log(fullname);
						}
					});
					if(JSON.stringify(searchResults) === "[]"){
						this.controller.set('responseMessage', "No Users with that name were found");
					}
					this.controller.set('searchResults', searchResults);
					this.controller.set('searching', false);
					this.controller.get('scroller').scrollVertical("#searchRes", {duration:800});
		  			this.store.unloadAll('user');
				});
			} else {

			}
			*/
		},
		storePieDataRef(ref){
			this.set('cdata', ref);
		},
		openBudget: function(){
			let _id = this.get("currentUser.uid") + "";
			let wedding = this.store.peekRecord('wedding', _id);
			let oldTotal = wedding.get('budgetTotal');
			let oldUsed = wedding.get('budgetUsed');
			this.controller.set('oldTotal', oldTotal);
			this.controller.set('oldUsed', oldUsed);
			this.send('openBudgetModal');
		},
		closeBudgetModal: function(){
			if(this.get('isSubmitted') === false){
				let _id = this.get("currentUser.uid") + "";
				let wedding = this.store.peekRecord('wedding', _id);
				let oldBudget = this.controller.get('oldTotal');
				let oldUsed = this.controller.get('oldUsed');
				wedding.set('budgetTotal', oldBudget);
				wedding.set('budgetUsed', oldUsed);
			}
			this.set('isSubmitted', false);
	    	this.send('removeModal');
		},
		submitBudget: function (){
			let _id = this.get("currentUser.uid") + "";
			let wedding = this.store.peekRecord('wedding', _id);
			this.set('isSubmitted', true);
			if(parseInt(wedding.get('budgetTotal')) > parseInt(wedding.get('budgetUsed'))){
				wedding.save().then(()=>{
					const _this = this;
					this.controller.set('refresh', false);
					Ember.run.next(function () {
				        _this.controller.set('refresh', true);
				    });
			    	this.controller.get('notifications').success('Budget has been updated!',{
		                autoClear: true
		            });
				});
			} else {
				let oldBudget = this.controller.get('oldTotal');
				let oldUsed = this.controller.get('oldUsed');
				wedding.set('budgetTotal', oldBudget);
				wedding.set('budgetUsed', oldUsed);
		    	this.controller.get('notifications').error('Total budget cannot be less than used budget!',{
	                autoClear: true
	            });
			}

		},
		dateChanged: function (date, valid){
			if(valid){
				this.controller.set('selectedDate', date);
				let _id = this.get("currentUser.uid") + "";
				let wedding = this.store.peekRecord('wedding', _id);
				let oldWeddingDate = wedding.get('weddingDate');
				this.dateDiff(this.controller.get('computedSelected'), this.controller.get('dateCurrent'));
				if(wedding.get('tasksGenerated')) {
					wedding.set('weddingDateChanged', oldWeddingDate);
				} else {

				}
				wedding.set('weddingDate', date);
				wedding.save();
			}
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
		ok: function() {
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			switch(_modalData.get('action')) {
				case 'delete':

			    let _id = this.get("currentUser.uid") + "";
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
			}
		}

	}
});
