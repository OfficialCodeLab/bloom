import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('user', _id);				
	},
	actions: {
		searchUser(){
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			let _name = this.controller.get('name') + "";
			_name = _name.toLowerCase();
			let _oldname = this.controller.get('oldname') + "";
			_oldname = _oldname.toLowerCase();
			let key = 0;
			if(_name !== '' && _name !== " " && _name !== _oldname){
				this.controller.set('responseMessage', "");
				//console.log("SEARCHING FOR: " + _name);
				let searchResults = [];
				this.controller.set('searching', true);
				this.store.query('user',  {}).then((users) =>{
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
						}
					});
					if(JSON.stringify(searchResults) === "[]"){
						this.controller.get('notifications').warning('No Users with that name were found.',{
				            autoClear: true
				        });
					}
					this.controller.set('oldname', _name);
					this.controller.set('searchResults', searchResults);
					this.controller.set('searching', false);
					this.controller.get('scroller').scrollVertical("#searchRes", {duration:800});
  					this.store.unloadAll('user');
		  			this.store.findRecord('user', _id);
				});
			} else {

			}
		},
		ok: function () {
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			switch(_modalData.get('action')) {
				case 'delete':
					
					let _id = this.get("session").get('currentUser').providerData[0].uid + "";
					let user = this.store.peekRecord('user', _id);
					// let _user = this.store.peekRecord(this.controller.get('user'));
					user.get('innercircle').removeObject(this.controller.get('user'));
					user.save().then(()=>{
						this.controller.get('notifications').info('Inner circle member removed!',{
							autoClear: true
						});
					});

					break;
			}
		},
		addInnerCircle(_user){
			let searchRes = Ember.get(this.controller.get('searchResults'), _user.key+ "");
			Ember.set(searchRes, 'adding', true);
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			let user = this.store.peekRecord('user', _id);
			let that = this;
			this.store.findRecord('userstat', _user.id).then((stats)=>{

					
					user.get('innercircle').then((circle) => {	
						let len = circle.get('length');	
						let i = 0;	
						var BreakException = {}; //  For lazy hackaround to break .forEach() loop
						try{
							circle.forEach(function(c){
					  			i++;
					  			if(c.id === stats.id){
					  				that.controller.get('notifications').warning('User is already in your inner circle!',{
										autoClear: true
									});
									Ember.set(searchRes, 'adding', '');								
	    							throw BreakException; // Yep I am a monster
					  			} else if (len === i) {
									user.get('innercircle').pushObject(stats);
									user.save().then(()=>{
										that.controller.get('notifications').success('User added successfully!',{
										  autoClear: true
										});
										that.sendMail(user, _user);
										Ember.set(searchRes, 'adding', '');
									});
					  			}
					  		});
						} catch (ex){
							if (ex !== BreakException) {
								throw ex;
							}
						}
						
					});
				//}
				
			},()=>{
				let stats = this.store.createRecord('userstat', {
					id: _user.id,
					name: _user.name
				});
				stats.save();
				user.get('innercircle').pushObject(stats);
				user.save().then(()=> {
					this.controller.get('notifications').success('User added successfully!',{
					  autoClear: true
					});
					Ember.set(searchRes, 'adding', '');
					that.sendMail(user, _user);
				});
			});

		},
		removeInnerCircle(_user){
			let _modalData;
			this.controller.set('user', _user);
			if(this.controller.get('modalDataId')){
				_modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
				_modalData.set('mainMessage', 'This deletion is permeanent.');	
				_modalData.set('action', 'delete');	
            	this.send('showModal', 'modal-confirm', _modalData);	            	
            } else {
		    	let _modalData = this.store.createRecord('modal-data', {'mainMessage': 'This deletion is permeanent.', 'action': 'delete'});
		     	this.controller.set('modalDataId', _modalData.get('id'));
            	this.send('showModal', 'modal-confirm', _modalData);
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
  			this.refresh();	
			this.controller.set('searchPartial', false);			
		},
		willTransition(){
			//GC for modal when transitioning
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			if(_modalData){
				_modalData.deleteRecord();
			}
			let _id = this.get("session").get('currentUser').providerData[0].uid + "";
  			this.store.findRecord('user', _id);
		}
	},
	sendMail: function (user, _user){
		this.store.findRecord('user', _user.id).then((__user) => {
			let message = this.store.createRecord('message', {
	          to: __user.get('email'),
	          from: user.get("email"),
	          subject: "You Have Been Added to an Inner Circle",
	          html: "Hi, I have added you to my inner circle",
	          senderId: user.get("id"),
	          senderName: user.get("name"),
	          receiverName: __user.get("name")
	        });
	        message.save();
		});
	}
});
