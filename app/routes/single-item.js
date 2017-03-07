import Ember from 'ember';

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
	    this._super(controller, model);

	    // controller.set('title', 'Edit library');
	    // controller.set('buttonLabel', 'Save changes');
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

	    openContactModalInit: function(){
	    	let venName = this.controller.get('model.vendor.name');
	    	let venEmail = this.controller.get('model.vendor.email');
	    	let venId = this.controller.get('model.vendor.id');
	    	this.send('openContactModal', venName, venEmail, venId);
	    },
	    imgPrev: function(){
	    	let isRunning = true;
	    	let breakThis = 0;

	    	while(isRunning){
		    	let currentSlide = this.controller.get('currentSlide');
		    	if (currentSlide === 0){
		    		currentSlide = 3;
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
		    		if(breakThis >= 4){
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
				if (currentSlide === 3){
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
		    		if(breakThis >= 4){
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
		this.controller.set(imgStr, true);
	}
});