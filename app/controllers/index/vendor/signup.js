import Ember from 'ember';

export default Ember.Controller.extend({
	
	isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
    passwordLength: Ember.computed.gte('password.length', 8),
    name: '',
    email: '',
    desc: '',
    addressL1: '',
    addressL2: '',
    city: '',
    postalcode: '',
    cell: '',
    id: ''
});
