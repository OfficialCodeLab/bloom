import Ember from 'ember';

const VendorSignupForm = Ember.component.extend({
    isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
    passwordLength: Ember.computed.gte('password.length', 8),
    storeName: '',
	beforeModel: function() {
	  	return this.get("session").fetch().catch(function() {});
    },
    actions: {
        signBtn() {
            this.set('storeName', this.get('parentView.targetObject.store'));
            let store = this.get('storeName');
            let regex = this.get('isValidEmail');
            let passLength = this.get('passwordLength');
            let customID = this.get('customID');
            let email = this.get('email');
            let hash = this.hashCode(email);

            if (this.get('name')) {  																//Check name field
                if (passLength) {																	//Check password length
                    if (this.get('password') === this.get('passwordConfirm')) {						//Check passwords match
                        if (regex) {																//Check email with regex
                            if (customID) {															//Check if user is using custom ID
                                store.findRecord('vendor', customID).then(() => {					//Check if ID exists already
                                    alert("User ID Already exists");
                                }, () => {
                                    store.find('vendorLogin', hash).then(() => {					//Check if email is in use
                                        alert("Email address already in use");
                                    }, () => {
                                        let vendorLogin = store.createRecord('vendorLogin', {		//Create vendorLogin record
                                            id: hash,
                                            email: email,
                                            password: this.get('password')
                                        });
                                        vendorLogin.save().then(() => {								//Save vendorLogin
                                            let vendor = store.createRecord('vendor', {				//Create vendor record
                                                id: this.get('customID'),
                                                name: this.get('name'),
                                                email: this.get('email'),
                                                desc: this.get('desc'),
                                                addressL1: this.get('addressL1'),
                                                addressL2: this.get('addressL2'),
                                                city: this.get('city'),
                                                postalcode: this.get('postalcode'),
                                                cell: this.get('cell')
                                            });
                                            vendor.save().then(()=>this.assignToUser(vendor.get('id')));			//Save vendor
                                        });
                                    });
                                });
                            } else {
                                store.find('vendorLogin', hash).then(() => {						//Check if email is in use
                                    alert("Email address already in use");
                                }, () => {
                                    let vendorLogin = store.createRecord('vendorLogin', {			//Create vendorLogin record
                                        id: hash,
                                        email: email,
                                        password: this.get('password')
                                    });
                                    vendorLogin.save().then(() => {									//Save vendorLogin
                                        let vendor = store.createRecord('vendor', {					//Create vendor record
                                            name: this.get('name'),
                                            email: this.get('email'),
                                            desc: this.get('desc'),
                                            addressL1: this.get('addressL1'),
                                            addressL2: this.get('addressL2'),
                                            city: this.get('city'),
                                            postalcode: this.get('postalcode'),
                                            cell: this.get('cell')
                                        });
                                        vendor.save().then(()=>this.assignToUser(vendor.get('id')));				//Save vendor
                                    });
                                });
                            }

                        } else {
                            alert("Not a valid email address");
                        }
                    } else {
                        alert("Passwords don't match");
                    }
                } else {
                    alert("Password not long enough");
                }

            } else {
                alert("Pls enter naem");
            }
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
        let store = this.get('storeName');
    	let users = store.peekRecord('user', this.get('params')[0]);
    	users[0].set('vendorAccount', id);
    	users[0].save();
    }
});

VendorSignupForm.reopenClass({
  positionalParams: 'params'
});

export default VendorSignupForm;