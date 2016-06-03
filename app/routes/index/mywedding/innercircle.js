import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		let _id = this.get("session").content.currentUser.id + "";
		return this.store.findRecord('user', _id);				
	},
	actions: {
		searchUser(){
			let _id = this.get("session").content.currentUser.id + "";
			let _name = this.controller.get('name').toLowerCase();
			let key = 0;
			if(_name !== '' && _name !== " "){
				this.controller.set('responseMessage', "");
				//console.log("SEARCHING FOR: " + _name);
				let searchResults = [];
				this.controller.set('searching', true);
				this.store.query('user',  {}).then((users) =>{
				  // Do something with `peters`
				  	users.forEach(function(user){
						let fullname = user.get('name') + " " + user.get('surname'); 	
						if(~fullname.toLowerCase().indexOf(_name)){
							searchResults.pushObject({
								name: fullname,
								id: user.get("id"),
								response: '',
								adding: '',
								key: key
							});
							key++;
							//console.log(fullname);
						}
					});
					if(JSON.stringify(searchResults) === "[]"){
						this.controller.set('responseMessage', "No Users with that name were found");
					}
					this.controller.set('searchResults', searchResults);
					this.controller.set('searching', false);
					this.controller.get('scroller').scrollVertical("#searchRes", {duration:800});
		  			this.store.findRecord('user', _id);
				});
			} else {

			}
		},
		addInnerCircle(_user){
			let searchRes = Ember.get(this.controller.get('searchResults'), _user.key+ "");
			Ember.set(searchRes, 'adding', true);
			let _id = this.get("session").content.currentUser.id + "";
			let user = this.store.peekRecord('user', _id);
			this.store.findRecord('userstat', _user.id).then((stats)=>{
				user.get('innercircle').pushObject(stats);
				user.save().then(()=>{
					Ember.set(searchRes, 'response', 'User added');
					Ember.set(searchRes, 'adding', '');
				});
			},()=>{
				let stats = this.store.createRecord('userstat', {
					id: _user.id,
					name: _user.name
				});
				stats.save();
				user.get('innercircle').pushObject(stats);
				user.save().then(()=> {
					Ember.set(searchRes, 'response', 'User added');
					Ember.set(searchRes, 'adding', '');
				});
			});

		},
		removeInnerCircle(_user){
			let confirmation = confirm("Are you sure?");

			if (confirmation) {
				let _id = this.get("session").content.currentUser.id + "";
				let user = this.store.peekRecord('user', _id);
				user.get('innercircle').removeObject(_user);
				user.save();
			}
		},
		closeMessage(){
			this.controller.set('responseMessage', "");
		},
		closeMessageAdded(user){
			let searchRes = Ember.get(this.controller.get('searchResults'), user.key+ "");
			Ember.set(searchRes, 'response', '');
		},
		showSearchPartial(){
			this.controller.set('searchPartial', true);
		},
		backBtn(){
			this.controller.set('searchPartial', false);			
		},
		willTransition(){
  			this.store.unloadAll('user');			
		}
	}
});
