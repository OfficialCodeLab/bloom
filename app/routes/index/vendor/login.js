import Ember from 'ember';

export default Ember.Route.extend({

    beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
          }
          return sesh;
    },
      model () {
        let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
        return this.store.peekRecord('user', _id);
      },
	actions: {
		login: function (){
			let hash = this.hashCode(this.controller.get('email'));					//Hash the email address
			this.store.findRecord('vendorLogin', hash).then((vendor) => {			//Find the vendor account login
                let _passhash = vendor.get('password') + "";
                let passhash = this.hashCode(this.controller.get('password')) + "";      //Hash the password
				if(_passhash === passhash) {		                    //Compare passwords
					this.assignToUser(vendor.get('vendorID'));						//Assign vendor account to user
				} else {
					this.controller.get('notifications').error('Incorrect password!',{
                        autoClear: true
                    });
				}
			}, () => {
				this.controller.get('notifications').error('Account does not exist!',{
                    autoClear: true
                });
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
    },
    assignToUser: function(id){
        //window.scrollTo(0,0);       
    	let user = this.store.peekRecord('user', this.get("session").get('currentUser').providerData[0]._uid);
        this.store.findRecord('vendor', id).then((vendor) => {
            user.set('vendorAccount', vendor);
            user.save().then(()=> {      
                this.transitionTo('index.vendor');                          
                this.controller.get('notifications').success('Logged in successfully!',{
                    autoClear: true
                });              
            }); 
        });
    }
});
