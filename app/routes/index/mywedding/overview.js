import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({

	model(){		
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('wedding', _id);	
	},
	setupController: function (controller, model) {
		this._super(controller, model);
		let weddingDate = model.get('weddingDate');
	  	controller.set('selectedDate', weddingDate);
		this.dateDiff(controller.get('computedSelected'), controller.get('dateCurrent'), controller);
	},
	dateDiff: function(d1, d2, controller){
		let d3 = moment(d1).unix()*1000;
		let d4 = moment(d2).unix()*1000;
		let dayStr = 'days';
		let preStr = 'Your wedding is in ';
		let days = Math.floor(( d3 - d4 ) / 86400000) + 1;
		if(days === 1){
			preStr = 'Your wedding is ';
			days = '';
			dayStr = "tomorrow!";
		} else if (days === 0 ) {
			preStr = 'Your wedding is ';
			days = '';
			dayStr = "today!";
		} else if (days === -1) {
			preStr = 'Your wedding was yesterday';
			days = '';
			dayStr = '';
		}else if (days < -1) {
			preStr = 'Your wedding was ';
			days = Math.sqrt(days*days);
			dayStr = 'days ago';
		}
		// console.log(moment);
		//  // let days = Math.floor(( d1 - d2 ) / 86400000);
		 // let days = d1.diff(d2, 'days');
		 if(controller){
		 	controller.set('computedFromNow', days);
		 	controller.set('dayString', preStr + days + " " + dayStr);
		 } else {
		 	this.controller.set('computedFromNow', days);
		 	this.controller.set('dayString', preStr + days + " " + dayStr);
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
		dateChanged: function (date, valid){
			if(valid){              
				this.controller.set('selectedDate', date);
				let _id = this.get("session").get('currentUser').providerData[0].uid + "";
				let wedding = this.store.peekRecord('wedding', _id);
				wedding.set('weddingDate', date);
				this.dateDiff(this.controller.get('computedSelected'), this.controller.get('dateCurrent'));	
				wedding.save();
			}
		}

	}
});
