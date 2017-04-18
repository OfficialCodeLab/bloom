import Ember from 'ember';

export default Ember.Route.extend({
	loadAmount: 0,
	loadCount: 0,
	vendorId: null,

	model(params){
		this.set('vendorId', params.vendor_id);

		return Ember.RSVP.hash({
            vendor: this.store.findRecord('vendor', params.vendor_id),
            vendorStat: this.store.findRecord('vendor-stat', params.vendor_id)
        });
		

	},
	afterModel(){
		let vendor = this.store.peekRecord('vendor', this.get('vendorId'));
		let catItems = vendor.get('catItems');
		this.set('loadAmount', catItems.get('length'));
   		this.resetLoadCount();
	},
	setupController: function (controller, model) {
     	this._super(controller, model);
     	controller.set('vendor', model.vendor);
     	controller.set('vendorStat', model.vendorStat);
     	controller.set('contactInfoVisible', false);
	    let id = this.get("session").get('currentUser').providerData[0].uid;
	    let vendorId = this.get('vendorId');
		this.send('storeVendorProfileVisited', vendorId, id);
      controller.set('website', model.vendorStat.get('website'));
	},
  	activate: function(){
  		window.scrollTo(0,0);
  	},
  	actions: {
	    openContactModalInit: function(){
	    	let venId = this.controller.get('model.vendor.id');
	    	let venName = this.controller.get('model.vendor.name');
	    	let venEmail = this.controller.get('model.vendor.email');
	    	this.send('openContactModal', venName, venEmail, venId);
	    },

	    loadedImg: function() {     
	      let c = this.get('loadCount');
	      let la = this.get('loadAmount');
	      c++;
	      let percentLoaded = (c / la) * 100;
	      percentLoaded = parseInt(percentLoaded);
	      this.controller.set('percentLoaded', percentLoaded);
	      this.set('loadCount', c);
	     if(c >= la){
	        Ember.$('#masonry-items').fadeIn("fast");
	        Ember.$('#loading-spinner').fadeOut("fast");
	      }
	      try{
	          var $container = this.controller.get('masonryRef');
	          $container.layout();        
	      } catch(ex){}


	    },
	    showContactInfo: function(){
	    	let userId = this.get("session").get('currentUser').providerData[0].uid;
	    	let vendorId = this.controller.get('model.id');
	    	this.controller.set('contactInfoVisible', true);
	    	this.send('storeContactInfoRequest', vendorId, userId);
	    }
  	},
	resetLoadCount: function (){
	  try{
	     this.controller.set('percentLoaded', 0);
	     this.controller.set('isLoaded', false);
	     Ember.$('#masonry-items').fadeOut(0);
	     Ember.$('#loading-spinner').fadeIn(0); 
	  } catch(ex){}
     this.set('loadCount', 0);   
	}
});
