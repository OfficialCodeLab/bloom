import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	name: '',
	category: '',
	price: '',
	desc: '',
	imageURL: '', //Probably make a regex in future or file selection
	isCreating: '',
	responseMessage: '',
	imgBlob: '',
	noName: Ember.computed.none('name'),
	noCat: Ember.computed.none('category'),
	noPrice: Ember.computed.none('price'),
	noDesc: Ember.computed.none('desc'),
	noImageURL: Ember.computed.none('imageURL'),
	itemNotCreated: Ember.computed.and('noName', 'noPrice', 'noDesc', 'noImageURL'),
	confirmTransition: 0,
	tempTransition: '',
	isNumber: Ember.computed.match('price', /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/),
	isValidNumber: Ember.computed.and('isNumber', 'price'),
	isLongName: Ember.computed.gte('name.length', 5),
	isLongDesc: Ember.computed.gte('desc.length', 5),
	isNotCreating: Ember.computed.not('isCreating'),
	isValid: Ember.computed.and('isLongName', 'isLongDesc', 'category', 'isValidNumber', 'imageURL', 'isNotCreating'),
	isNotValid: Ember.computed.not('isValid'),
    actions: {
    	selectCat(value){
			this.set('category', value);
		}
    },

	addedFile: function(file) {
        console.log('added: ', file, this);
        //UPLOAD TO FIREBASE STORAGE
    }
});
