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
	confirmTransition: 0,
	isNumber: Ember.computed.match('price', /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/),
	isValidNumber: Ember.computed.and('isNumber', 'price'),
	isLongName: Ember.computed.gte('name.length', 5),
	isLongDesc: Ember.computed.gte('desc.length', 5),
	isNotCreating: Ember.computed.not('isCreating'),
	isValid: Ember.computed.and('isLongName', 'isLongDesc', 'category', 'isValidNumber', 'imageURL', 'isNotCreating'),
	isNotValid: Ember.computed.not('isValid'),
	willingToTravel: 0,
    willTravel: Ember.computed.equal('willingToTravel', '1'),
    pricingOption: '3',
    maxDist: 0,
    province: '',
    isFixedPrice: Ember.computed.equal('pricingOption', '1'),
    isRangePrice: Ember.computed.equal('pricingOption', '2'),

	img0: true,
    img1: false,
    img2: false,
    img3: false,
    currentSlide: 0,
    actions: {
    	selectCat(){
		},
    }
});
