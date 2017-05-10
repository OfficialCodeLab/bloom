import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },
	model(){
		return this.store.findAll('user', {reload: true}).then((items) => {
	      return items.sortBy('name');
	    });
	},
	actions: {

		notImplemented() {
			this.controller.get('notifications').info('This does nothing :)',{
	            autoClear: true
	        });	

		},

		linkAccounts(id) {
			let user = this.store.peekRecord('user', id);
			let vendorIdCurrent = user.get("vendorAccount").get('id');
			console.log(vendorIdCurrent);

			this.store.findRecord("vendor", vendorIdCurrent).then((vendor)=>{
				vendor.get("loggedInUsers").pushObject(user);
				vendor.save().then(()=>{
					user.set("vendorAccount", vendor);
					user.save().then(()=>{
		    		this.controller.get('notifications').success('User has been updated successfully.',{
		            autoClear: true
		        });	
					});
				});
			});
			
		},
		addWedding(id){
			let user = this.store.peekRecord('user', id);
			let wedding = this.store.createRecord('wedding', 
				{
					id: id,
					user: user
				}
			);
			wedding.save();
			user.get('wedding').pushObject(wedding);
			user.save();
		},
		destroyUser(id){
			let confirmation = confirm('Are you sure?');

			if (confirmation) {
				let user = this.store.peekRecord('user', id);
				let _this = this;

				this.store.findRecord('wedding', id).then((wedding)=>{

					function removeFavs() {	
						console.log("Removing Favs");		
					 	return new Promise(function(resolve, reject) {
							user.get("favourites").then((favs) => {
								let favsCount = 0;
								let favsTotal = favs.length;
								if(favsTotal === 0) {
									console.log("No Favs");
						 			resolve();
								} else {
									favs.forEach(function(fav){
										fav.get('favouritedBy').removeObject(user);
										fav.save().then(()=>{
											favsCount++;
											if (favsTotal <= favsCount) {
												console.log("Removed Favs");
												resolve();
											}
										});
									});									
								}
							}, ()=>{
								console.log("No Favs");
					 			resolve();
							}); 	
						});			
					}

					function removeGuests() {
						console.log("Removing Guests");
						return new Promise(function(resolve, reject) {
							wedding.get("guests").then((guests) => {
								let guestsCount = 0;
								let guestsTotal = guests.length;
								if(guestsTotal === 0){
									console.log("No Guests");
						 			resolve();
								} else {
									guests.forEach(function(guest){
										guest.destroyRecord().then(()=>{
											guestsCount++;
											if (guestsTotal <= guestsCount) {
												console.log("Removed Guests");
												resolve();
											}
										});
									});									
								}
							}, ()=>{
								console.log("No Guests");
					 			resolve();
							});			 			
					 			
						});	
					}

					function removeTasks() {
						console.log("Removing Tasks");
						return new Promise(function(resolve, reject) {
							wedding.get("tasks").then((tasks) => {
								let tasksCount = 0;
								let tasksTotal = tasks.length;
								if (tasksTotal === 0) {
									console.log("No Tasks");
						 			resolve();									
								} else {
									tasks.forEach(function(task){
										task.destroyRecord().then(()=>{
											tasksCount++;
											if (tasksTotal <= tasksCount) {
												console.log("Removed Tasks");
												resolve();
											}
										});
									});									
								}
							}, ()=>{
								console.log("No Tasks");
					 			resolve();
							});			 			
					 			
						});	
					}

					function removeBudget() {
						console.log("Removing Budget");
						return new Promise(function(resolve, reject) {
					 		_this.store.findRecord('budget', id).then((budget) => {
					 			budget.destroyRecord().then(()=>{
									console.log("Removed Budget");
					 				resolve();
					 			});
					 		}, () => {
								console.log("No Budget");
					 			resolve();
					 		});
						});	
					}

					function removeUser() {
						console.log("Removing User");
						return new Promise(function(resolve, reject) {
							user.destroyRecord().then(()=>{
								console.log("Removed User");
					 			resolve();
							});
						});	
					}

					function removeWedding() {
						console.log("Removing Wedding");
						return new Promise(function(resolve, reject) {
							wedding.destroyRecord().then(()=>{
								console.log("Removed Wedding");
					 			resolve();
							});
						});	
					}

					Promise.all([
						removeFavs(),
						removeGuests(),
						removeTasks(),
						removeBudget()
					]).then(() => {
						removeUser().then(()=>{
							removeWedding().then(()=>{
					    		_this.controller.get('notifications').success('User has been removed successfully.',{
						            autoClear: true
						        });	
						        _this.refresh();

					        });										
						});	
					});



				});
				
			}

		}
	}
});
