import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		//Before creating the record, clear the DS Store
		this.store.unloadAll('user');
		let _this = this;
    	let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
    	return new Promise (function(resolve, reject) {

	    	_this.store.findRecord('user', _id, {reload: true}).then((response) => {
				 // this.transitionTo('index');
				 _this.set('foundUser', true);
				 _this.store.findRecord('wedding', _this.get("session").get('currentUser').providerData[0]._uid);
				// alert('user found');
				resolve(response);
	     	}, () => {
				Ember.$('#usernew').fadeIn("fast");  //Run relevant jquery methods in component
		        try {
		        	// let _id = this.get("session").get('currentUser').providerData[0]._uid;
		            ///return response;
		        	//console.log(request);
		        	//let surname = this.get("session").get('currentUser').providerData[0].last_name;
		        	let full_name = _this.get("session").get('currentUser').providerData[0].displayName;
		        	let x = full_name.indexOf(" ");
		        	let name = full_name.substring(0, x);
		        	let surname = full_name.substring(x+1, full_name.length);
					var user = _this.store.createRecord('user', {
					  name: name,
					  surname: surname,
					  id: _id,
					  email: _this.get("session").get('currentUser').providerData[0].email,
					  mustTourWedding: true,
					  mustTourFavourites: true,
					  mustTourVendor: true,
					  isNewToBloom: true
					});

					let wedding = _this.store.createRecord('wedding', 
						{
							id: _id,
							user: user
						}
					);
					wedding.save();
					user.get('wedding').pushObject(wedding);
					user.save();

			    	resolve(user);

				} catch(ex){
					//If any problems occur, just navigate to index
					_this.transitionTo('index');
				}

			
	 		}).catch((err)=>{});
    	});
    },
    beforeModel() {
    	//Get the user ID
	    var sesh = this.get("session").fetch().catch(function() {});
	    if(!this.get('session.isAuthenticated')){
	        // transition.abort();
	        // Default back to homepage
	        this.transitionTo('login');
	    } 

    	//Check the local store first for record of the user
   //  	var localusr = this.store.peekRecord('user', _id);
   //  	if(localusr !== null){
			// this.transitionTo('index');
   //  	}

    	//Else check server for the record

    	
  },
  setupController(controller, model) {
  	this._super(controller, model);
  	let isTesting = controller.get('isTesting');
  	if(!isTesting && this.get('foundUser')) {
  		this.transitionTo('index');
  	}
  },
    actions: {
        nextSection() {
            this.controller.set('section0', false);
            this.controller.set('percentLoaded', 100);

        },
        prevSection() {
            this.controller.set('section0', true);
            this.controller.set('percentLoaded', 50);

        },

		dateChanged: function (date, valid){
			if(valid){              
				this.controller.set('birthday', date);
				let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
				let user = this.store.peekRecord('user', _id);
				user.set('birthday', date);
				user.save();
			}
		},

		dateChangedWed: function (date, valid){
			if(valid){         
				this.controller.set('weddingDate', date);     
				let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
				let wedding = this.store.peekRecord('wedding', _id);
				let oldWeddingDate = wedding.get('weddingDate');
				if(wedding.get('tasksGenerated')) {
					wedding.set('weddingDateChanged', oldWeddingDate);
				} else {

				}
				wedding.set('weddingDate', date);
				wedding.save();
			}
		},
		submitAccount() {
			this.controller.set('isCreating', true);
			let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
			let wedding = this.store.peekRecord('wedding', _id);
			let estGuests = this.controller.get('estimatedGuests');
			wedding.set('estimatedGuests', estGuests);
			wedding.save().then(()=>{
	    		window.scrollTo(0,0);
				this.transitionTo('index');
			});

		},
    	
		//If the save user button is clicked
		saveUser() { 
    		window.scrollTo(0,0);
			this.transitionTo('index');
		},

		willTransition(transition) {
			//Saves the model regardless of how the user navigates
			let user = this.controller.get('model');
			if(user.get('email') !== undefined && user.get('email') !== ""){
				user.save();
				this.controller.set('isCreating', false);
	    		this.controller.get('notifications').success('Account Finalized!',{
				  autoClear: true
				});
			} else {
	            transition.abort();
				this.controller.set('isCreating', false);
	    		this.controller.get('notifications').error('Please enter your email!',{
				  autoClear: true
				});
	            this.controller.set('section0', true);
	            this.controller.set('percentLoaded', 50);
			}
		},
		didInsertElement(){
			Ember.$('#usernew').fadeOut(0);    //Run relevant jquery methods in component
		}
  }

});