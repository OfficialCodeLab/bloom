import Ember from 'ember';

const MAX_IMAGES = 5;

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },
    model(params) {
    	return this.store.findRecord('catItem', params.catItem_id);
  	},
  	setupController(controller, model) {
			let _this = this;
	    this._super(controller, model);
     	controller.set('contactInfoVisible', false);
	    let id = this.get("currentUser.uid");
			let willingToTravel = model.get('willingToTravel');
			let maxTravelDist = model.get('maxTravelDist');
			if(willingToTravel && !maxTravelDist) {
				controller.set('notOnline', false);
			} else {
				controller.set('notOnline', true);
			}
	    model.get('vendor').then((ven)=>{
			  this.send('storeVendorProfileVisited', ven.get('id'), id);
				this.store.findRecord('vendor-stat', ven.get('id')).then((venstat)=>{
	      	controller.set('website', venstat.get('website'));
				});
			});
  	},
	actions: {
		goBack: function(){
			window.history.go(-1);
		},
		priceClick: function(){
			alert("TEST");
	    	window.scrollTo(0, 0);
			// let id = this.controller.get('model.vendor.id')
			// this.send('vendorClick', id);
		},
		showContactInfo: function(){
			let userId = this.get("currentUser.uid");
			let vendorId = this.controller.get('model.id');
			this.controller.set('contactInfoVisible', true);
			this.send('storeContactInfoRequest', vendorId, userId);
		},

	    openContactModalInit: function(){
	    	let venName = this.controller.get('model.vendor.name');
	    	let venEmail = this.controller.get('model.vendor.email');
	    	let venId = this.controller.get('model.vendor.id');
	    	this.send('openContactModal', venName, venEmail, venId);
	    },
	    imgPrev: function(){
	    	let isRunning = true;
	    	let breakThis = 0;
	    	let currentSlide = this.controller.get('currentSlide');

	    	while(isRunning){
		    	if (currentSlide === 0){
		    		currentSlide = MAX_IMAGES;
		    	} else {
		    		currentSlide--;
		    	}

		    	let imageSuffix = '';
		    	if(currentSlide === 0) {
		    		imageSuffix = "URL";
		    	} else {
		    		let calcIndex = currentSlide - 1;
		    		imageSuffix = calcIndex + '';
		    	}

		    	let toGetString = "model.image" + imageSuffix;
		    	if(this.controller.get(toGetString)){
		    		this.setImageSlide(currentSlide);
		    		isRunning = false;
		    	} else {
		    		breakThis++;
		    		if(breakThis >= MAX_IMAGES+1){
		    			isRunning = false;
		    		}
		    	}
		    }
	    },
	    imgNext: function(){
	    	let isRunning = true;
	    	let breakThis = 0;
	    	let currentSlide = this.controller.get('currentSlide');

	    	while(isRunning){
				if (currentSlide === MAX_IMAGES){
		    		currentSlide = 0;
		    	} else {
		    		currentSlide++;
		    	}

		    	let imageSuffix = '';
		    	if(currentSlide === 0) {
		    		imageSuffix = "URL";
		    	} else {
		    		let calcIndex = currentSlide - 1;
		    		imageSuffix = calcIndex + '';
		    	}

		    	let toGetString = "model.image" + imageSuffix;
		    	if(this.controller.get(toGetString)){
		    		this.setImageSlide(currentSlide);
		    		isRunning = false;
		    	} else {
		    		breakThis++;
		    		if(breakThis >= MAX_IMAGES+1){
		    			isRunning = false;
		    		}
		    	}
	    	}
	    }
	},
	setImageSlide: function(slide){
		this.controller.set('currentSlide', slide);
		let imgStr = "img" + slide;
		this.controller.set("img0", false);
		this.controller.set("img1", false);
		this.controller.set("img2", false);
		this.controller.set("img3", false);
		this.controller.set("img4", false);
		this.controller.set("img5", false);
		this.controller.set(imgStr, true);
	}
});
