import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
	cdata: null,
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
		let dayStr = 'Days left';
		// let preStr = 'Your wedding is in ';
		let days = Math.floor(( d3 - d4 ) / 86400000) + 1;
		if(days === 1){
			dayStr = 'Day left';
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
		refreshButton(){
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
	        let wedding = this.store.peekRecord('wedding', _id);
	        let bTotal = wedding.get('budgetTotal');
	        let bUsed = wedding.get('budgetUsed');
	        if(bTotal === null){
	        	bTotal = 0;
	        	wedding.set('budgetTotal', 0);
	        }
	        if(bUsed === null){
	        	bUsed = 0;
	        	wedding.set('budgetUsed', 0);
	        }

	        this.set('budgetTotal', bTotal);
	        this.set('budgetUsed', bUsed);
	    	wedding.save();
			this.set('cdata', Ember.A([
			{
		        value: this.get('budgetTotal') - this.get('budgetUsed'),
		        color: "#808080",
		        highlight: "#9E9E9E",
		        label: "Remaining"
		    }, 
		    {
		        value: this.get('budgetUsed'),
		        color: "#F48FB1",
		        highlight: "#F8BBD0",
		        label: "Used"
		    }
    		]));
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
