import Ember from 'ember';

export default Ember.Route.extend({

	model(){		
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('wedding', _id);	
	},
	setupController: function (controller, model) {
		this._super(controller, model);
	  	controller.set('selectedDate', model.get('weddingDate'));
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
				wedding.save();
			}
		}

	}
});
