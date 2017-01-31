import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
    passwordLength: Ember.computed.gte('password.length', 8),
    section1: true,
    currentSection: 1,
    name: '',
    email: '',
    desc: '',
    addressL1: '',
    addressL2: '',
    city: '',
    password: '',
    passwordConfirm: '',
    postalcode: '',
    cell: '',
    id: ''
});
