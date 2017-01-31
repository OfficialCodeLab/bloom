import Ember from 'ember';

export default Ember.Route.extend({
	tempId: '',
	beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(this.get('session.isAuthenticated')){
            this.transitionTo('not-found');
        }
        return sesh;
    },
    model(){
        // return Ember.RSVP.hash({
        //     country: this.store.findRecord('countries', 'South_Africa')
        // });
    },
    setupController(controller, model) {
        // this._super(controller, model);
        // Ember.set(controller, 'catItem', model.catItem);
        // Ember.set(controller, 'country', model.country);

        // let catItem = this.controller.get('model.catItem');
        // let cat = catItem.get('category');
        // let cat_id = cat.get('id');
        // this.controller.set('category', cat_id);
      },
    actions: {
        nextSection() {
            let section = this.controller.get('currentSection');
            section++;
            if(section === 2){
                this.controller.set('section1', false);
            }
            this.controller.set('currentSection', section);

        },
        prevSection() {
            let section = this.controller.get('currentSection');
            section--;
            if(section === 1){
                this.controller.set('section1', true);
            }
            this.controller.set('currentSection', section);

        },
        signBtn() {
            let regex = this.controller.get('isValidEmail');
            let passLength = this.controller.get('passwordLength');
            let customID = this.controller.get('customID');
            let email = this.controller.get('email');
            let hash = this.hashCode(email);
            let passhash = this.hashCode(this.controller.get('password'));
            //if(email === null )

            if (this.controller.get('name')) {  															//Check name field
                if (passLength) {																			//Check password length
                    if (this.controller.get('password') === this.controller.get('passwordConfirm')) {		//Check passwords match
                        if (regex) {																		//Check email with regex
                            if (customID) {																	//Check if user is using custom ID
                                this.store.findRecord('vendor', customID).then(() => {						//Check if ID exists already
                                    this.controller.get('notifications').error('User ID Already exists!',{
                                        autoClear: true
                                    });
                                }, () => {
                                    this.store.findRecord('vendorLogin', hash).then(() => {					//Check if email is in use
                                        this.controller.get('notifications').error('Email address already in use!',{
                                            autoClear: true
                                        });
                                    }, () => {
                                        let vendorLogin = this.store.createRecord('vendorLogin', {			//Create vendorLogin record
                                            id: hash,
                                            email: email,
                                            password: passhash,
                                            passTemp: this.controller.get('password')
                                        });
                                        let vendor = this.store.createRecord('vendor', {				//Create vendor record
                                            id: this.controller.get('customID'),
                                            name: this.controller.get('name'),
                                            email: this.controller.get('email'),
                                            desc: this.controller.get('desc'),
                                            addressL1: this.controller.get('addressL1'),
                                            addressL2: this.controller.get('addressL2'),
                                            city: this.controller.get('city'),
                                            postalcode: this.controller.get('postalcode'),
                                            cell: this.controller.get('cell'),
                                            maxItems: "15"
                                        });		
    									let _vendorid = vendor.get('id');													
                                    	vendorLogin.set('vendorID', _vendorid);							//Add id to vendorLogin
										this.assignToUser(vendor, vendorLogin);							//Add id to user
                                    });
                                });
                            } else {
                                this.store.findRecord('vendorLogin', hash).then(() => {						//Check if email is in use
                                    this.controller.get('notifications').error('Email address already in use!',{
                                        autoClear: true
                                    });
                                }, () => {
                                    let vendorLogin = this.store.createRecord('vendorLogin', {				//Create vendorLogin record
                                        id: hash,
                                        email: email,
                                        password: passhash,
                                        passTemp: this.controller.get('password')
                                    });
                                    let vendor = this.store.createRecord('vendor', {						//Create vendor record
                                        name: this.controller.get('name'),
                                        email: this.controller.get('email'),
                                        desc: this.controller.get('desc'),
                                        addressL1: this.controller.get('addressL1'),
                                        addressL2: this.controller.get('addressL2'),
                                        city: this.controller.get('city'),
                                        postalcode: this.controller.get('postalcode'),
                                        cell: this.controller.get('cell'),
                                        maxItems: "15"
                                    });		
    								let _vendorid = vendor.get('id');
                                	vendorLogin.set('vendorID', _vendorid);									//Add id to vendorLogin										
                                	this.assignToUser(vendor, vendorLogin);									//Add id to user
                                });
                            }

                        } else {
                            this.controller.get('notifications').error('Not a valid email address!',{
                                autoClear: true
                            });
                        }
                    } else {
                        this.controller.get('notifications').error('Passwords don\'t match!',{
                            autoClear: true
                        });
                    }
                } else {
                    this.controller.get('notifications').error('Password not long enough!',{
                        autoClear: true
                    });
                }

            } else {
                this.controller.get('notifications').error('Please enter a name!',{
                    autoClear: true
                });
            }
        }
    },
    hashCode: function(str) {  //String to hash function
        if (str === undefined){
            str = '';
        }
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
    assignToUser: function(vendor, vendorLogin){
    	//Need to log in first:
    	let _vendorid = vendor.get('id');
    	this.send('storeVendorId', _vendorid, vendor, vendorLogin);
    	this.send('showLogins');
    },
});