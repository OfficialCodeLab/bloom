import Ember from 'ember';

export default Ember.Route.extend({
	tempId: '',
	beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(this.get('session.isAuthenticated')){            
             this.get('session').close().then(()=> {
                this.controller.get('notifications').info('Logged out successfully.',{
                  autoClear: true
                });
             });
        }
        return sesh;
    },
    actions: {
        nextSection() {
            this.controller.set('section1', false);

        },
        prevSection() {
            this.controller.set('section1', true);

        },
        logBtn() {
            let _this = this;
            this.controller.set('isLoggingIn', true);

            _this.get("session").open("firebase", { 
                provider: "password", 
                email: this.controller.get('logInEmail'),
                password: this.controller.get('logInPassword')
            }).then((d) => {
                _this.store.findRecord('user', d.uid).then((user)=>{
                    _this.controller.get('notifications').info('Logged in successfully!.',{
                        autoClear: true
                     });
                    _this.generateUid();
                    _this.controller.set('isLoggingIn', false);
                    _this.transitionTo('index');
                }, ()=> {       
                    _this.controller.get('notifications').info('User account created.',{
                       autoClear: true
                    });
                    _this.generateUid();
                    _this.controller.set('isLoggingIn', false);
                    _this.transitionTo('user.new');                    
                });

            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              _this.controller.set('isLoggingIn', false);
                _this.controller.get('notifications').error(errorMessage,{
                    autoClear: true
                });
              // ...
            });
        },
        signBtn() {
            this.controller.get('notifications').warning('Sorry this is temporarily disabled for non-vendors!',{
                autoClear: true
            });
        },
        signBtnOld() {
            this.controller.set('isCreating', true);
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
                                let customIDRegex = this.controller.get('isValidCID');
                                if(customIDRegex) {
                                    this.store.findRecord('vendor', customID).then(() => {						//Check if ID exists already
                                        this.controller.get('notifications').error('User ID Already exists!',{
                                            autoClear: true
                                        });
                                        this.controller.set('isCreating', false);
                                        this.setSection(2);
                                    }, () => {
                                        this.store.findRecord('vendorLogin', hash).then(() => {					//Check if email is in use
                                            this.controller.get('notifications').error('Email address already in use!',{
                                                autoClear: true
                                            });
                                            this.controller.set('isCreating', false);
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
                                                province: this.controller.get('selectedProvince'),
                                                city: this.controller.get('city'),
                                                postalcode: this.controller.get('postalcode'),
                                                cell: this.controller.get('cell'),
                                                maxItems: "15"
                                            });	
        									let _vendorid = vendor.get('id');													
                                        	vendorLogin.set('vendorID', _vendorid);							//Add id to vendorLogin
                                            this.send('storeEmailPass', email, this.controller.get('password'));
    										this.assignToUser(vendor, vendorLogin);							//Add id to user
                                        });
                                    });
                                } else {                                                                    //Is nto valid CID
                                    this.controller.get('notifications').error('Custom Bloom Address cannot contain spaces or special characters and must be 3-20 characters long',{
                                        autoClear: true,
                                        clearDuration: 4000
                                    });
                                    this.controller.set('isCreating', false);
                                    this.setSection(2);
                                }
                            } else {
                                this.store.findRecord('vendorLogin', hash).then(() => {						//Check if email is in use
                                    this.controller.get('notifications').error('Email address already in use!',{
                                        autoClear: true
                                    });
                                    this.controller.set('isCreating', false);
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
                                        province: this.controller.get('selectedProvince'),
                                        city: this.controller.get('city'),
                                        postalcode: this.controller.get('postalcode'),
                                        cell: this.controller.get('cell'),
                                        maxItems: "15"
                                    });	
    								let _vendorid = vendor.get('id');
                                	vendorLogin.set('vendorID', _vendorid);									//Add id to vendorLogin	
                                    this.send('storeEmailPass', email, this.controller.get('password'));									
                                	this.assignToUser(vendor, vendorLogin);									//Add id to user
                                });
                            }

                        } else {
                            this.controller.get('notifications').error('Not a valid email address!',{
                                autoClear: true
                            });
                            this.controller.set('isCreating', false);
                            this.setSection(1);
                        }
                    } else {
                        this.controller.get('notifications').error('Passwords don\'t match!',{
                            autoClear: true
                        });
                        this.controller.set('isCreating', false);
                        this.setSection(1);
                    }
                } else {
                    this.controller.get('notifications').error('Password not long enough!',{
                        autoClear: true
                    });
                    this.controller.set('isCreating', false);
                    this.setSection(1);
                }

            } else {
                this.controller.get('notifications').error('Please enter a name!',{
                    autoClear: true
                });
                this.controller.set('isCreating', false);
               this.setSection(1);
            }
        }
    },
    generateUid: function() {

        let provData = this.get("session.currentUser").providerData[0];
        if(this.get("session.provider") === "password") {
            Ember.set(provData, '_uid', this.get("session.currentUser").uid);      
        } else {                    
            Ember.set(provData, '_uid', this.get("session.currentUser").providerData[0].uid);   
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
    }
});