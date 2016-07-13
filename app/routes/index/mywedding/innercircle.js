import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('user', _id);
	},
	actions: {
		searchUser(){
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
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
  					this.store.unloadAll('user');
		  			this.store.findRecord('user', _id);
				});
			} else {

			}
		},
		//This will run when the add button next to a user name is clicked
		addInnerCircle(_user){
			let searchRes = Ember.get(this.controller.get('searchResults'), _user.key+ "");
			Ember.set(searchRes, 'adding', true);
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			let user = this.store.peekRecord('user', _id);

			//Find a user based on search results, and push that user's
			//userstats record id to the current user's inner circle
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

			//TODO: Friends - Add your account as a friend under a user when you add them to your inner circle.

		this.store.findRecord('user', _user.id).then((fetchedUser)=>{
				fetchedUser.get('friends').pushObject(user);
				fetchedUser.save().then(()=>{

				});
			},()=>{

			});

			this.store.findRecord('user', _user.id).then((__user) => {
				let message = this.store.createRecord('message', {
		          to: __user.get('email'),
		          from: user.get("email"),
		          subject: "You Have Been Added to an Inner Circle",
		          html: "Hi, I have added you to my inner circle",
		          senderId: _id,
		          senderName: user.get("name"),
		          receiverName: __user.get("name")
		        });
		        message.save();
			});

		},
		removeInnerCircle(_user){
			let confirmation = confirm("Are you sure?");

			if (confirmation) {
				let _id = this.get("session").get('currentUser').providerData[0].uid + "";
				let user = this.store.peekRecord('user', _id);
				user.get('innercircle').removeObject(_user);
				user.save();
			}
		},
		debugFriend(){
			//Create a variable for the current user
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			let user = this.store.peekRecord('user', _id);

			this.store.findRecord('user', _id).then((currentlyLoggedInUser)=>{
							currentlyLoggedInUser.get('friends').pushObject(user);
							currentlyLoggedInUser.save().then(()=>{

							});
					},()=>{

					});
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
			let _id = this.get("session").content.currentUser.id + "";
  			this.store.findRecord('user', _id);
		}
	}
});
