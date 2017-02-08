import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
    passwordLength: Ember.computed.gte('password.length', 8),
    notChecked: Ember.computed.not('checked'),
    checked: false,
    section1: true,
    currentSection: 1,
    percentLoaded: 25,
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
