import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		changePassword: function(){
			let pass = this.controller.get('password');
			let _pass = this.controller.get('passwordConfirm');
			if(pass === _pass) {
				//alert(this.hashCode(pass));
			    let _id = this.get("session").get('currentUser').providerData[0].uid + "";
			    let passhash = this.hashCode(pass);
				let user = this.store.peekRecord('user', _id);
				let vendorAccount = user.get('vendorAccount');
				this.controller.set('password', '');
				this.controller.set('passwordConfirm', '');
				
				this.store.findRecord('vendor', vendorAccount, { reload: true }).then((vendor) => {
					let email = vendor.get('email');
					let emailhash = this.hashCode(email);

					this.store.findRecord('vendorLogin', emailhash).then((vendorLogin) => {
						vendorLogin.set('password', passhash);
						vendorLogin.save().then(()=> {
							this.controller.get('notifications').success('Password changed successfully!',{
				                autoClear: true
				            });  
							this.controller.set('showPasswordPartial', false);
						});
					});
				});
			} else {
				this.controller.get('notifications').error('Passwords do not match!',{
	                autoClear: true
	            });
			}
		},
		changeEmail: function(){
			let email = this.controller.get('email');
		    let emailhash = this.hashCode(email);
		    this.store.findRecord('vendorLogin', emailhash, { reload: true }).then(() => {						//Check if email is in use
                    alert("Email address already in use");
                }, () => {
			    let _id = this.get("session").get('currentUser').providerData[0].uid + "";
				let user = this.store.peekRecord('user', _id);
				let vendorAccount = user.get('vendorAccount');
				this.controller.set('email', '');		
				this.store.findRecord('vendor', vendorAccount, { reload: true }).then((vendor) => {
					let _email = vendor.get('email');
					let _emailhash = this.hashCode(_email);
					vendor.set('email', email);
					vendor.save().then(() => {
						this.store.findRecord('vendorLogin', _emailhash, { reload: true }).then((vendorLogin) => {
							let password = vendorLogin.get('password');
							let vendorID = vendorLogin.get('vendorID');
							vendorLogin.destroyRecord();
							let _vendorLogin = this.store.createRecord('vendorLogin', {			//Create vendorLogin record
                                id: emailhash,
                                email: email,
                                password: password,
                                vendorID: vendorAccount
                            });
							_vendorLogin.save().then(()=> {
								this.controller.get('notifications').success('Email changed successfully!',{
					                autoClear: true
					            });  
								this.controller.set('showEmailPartial', false);
							});
						});
					});
				});
			});
		},

		logout: function(){			
	    	let user = this.store.peekRecord('user', this.get("session").get('currentUser').providerData[0].uid);
	    	user.set('vendorAccount', '');
	    	user.save();
	    	this.transitionTo('index.vendor.login');
	    	this.controller.get('notifications').info('Logged out successfully!',{
                autoClear: true
            });  
		}
	},
    hashCode: function(str) {  //String to hash function
        let hash = 0,
            i, chr, len;
        if (str.length === 0) {
            return hash;
        }
        for (i = 0, len = str.length; i < len; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
});
