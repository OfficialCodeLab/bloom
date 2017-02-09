import Ember from 'ember';
const PAGE_COUNT = 4;

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
        return this.store.findRecord('country', 'south_africa').then((_country=>{
            return _country.get('province');
        }));
    },
    actions: {
        nextSection() {
            let section = this.controller.get('currentSection');
            section++;
            this.setSection(section);

        },
        prevSection() {
            let section = this.controller.get('currentSection');
            section--;
            this.setSection(section);

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
                                    this.setSection(2);
                                }, () => {
                                    this.store.findRecord('vendorLogin', hash).then(() => {					//Check if email is in use
                                        this.controller.get('notifications').error('Email address already in use!',{
                                            autoClear: true
                                        });
                                        this.setSection(1);
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
                                    this.setSection(1);
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
                            this.setSection(1);
                        }
                    } else {
                        this.controller.get('notifications').error('Passwords don\'t match!',{
                            autoClear: true
                        });
                        this.setSection(1);
                    }
                } else {
                    this.controller.get('notifications').error('Password not long enough!',{
                        autoClear: true
                    });
                    this.setSection(1);
                }

            } else {
                this.controller.get('notifications').error('Please enter a name!',{
                    autoClear: true
                });
               this.setSection(1);
            }
        },
        checkBox: function(){
            let checked = this.controller.get('checked');
            if(checked === true){
                this.controller.set('checked', false);
            } else {
                this.controller.set('checked', true);                
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
    setSection: function(x){
        this.controller.set('currentSection', x);
        let percentLoaded = (x/PAGE_COUNT)*100;
        this.controller.set('percentLoaded', percentLoaded);

        switch(x){
            case 1:
                this.controller.set('section1', true);
                this.controller.set('section2', false);
                this.controller.set('section3', false);
            break;

            case 2:
                this.controller.set('section1', false);
                this.controller.set('section2', true);
                this.controller.set('section3', false);
            break;

            case 3:
                this.controller.set('section1', false);
                this.controller.set('section2', false);
                this.controller.set('section3', true);
            break;

            case 4:
                this.controller.set('section1', false);
                this.controller.set('section2', false);
                this.controller.set('section3', false);
                this.controller.set('section4', true);
            break;
        }
    }
});