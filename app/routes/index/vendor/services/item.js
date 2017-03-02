import Ember from 'ember';

export default Ember.Route.extend({
	model(params){
		return Ember.RSVP.hash({
	    	catItem: this.store.findRecord('catItem', params.catItem_id),
			category: this.store.findAll('category'),
			province: this.store.findRecord('country', 'south_africa').then((_country=>{
                return _country.get('province');
            })),
	    });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    Ember.set(controller, 'catItem', model.catItem);
	    Ember.set(controller, 'category', model.category);

	    //Select Category
		let catItem = controller.get('model.catItem');
		let cat = catItem.get('category');
		let cat_id = cat.get('id');
		controller.set('category', cat_id);

		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
        let user = this.store.peekRecord('user', _id);
  	    let vendorId = user.get('vendorAccount');

 		//If vendor is willing to travel, autopopulate
 		let willingToTravel = catItem.get('willingToTravel');
 		if(willingToTravel == 'true'){
 			controller.set('maxDist', catItem.get('maxTravelDist'));
 			controller.set('willingToTravel', '1');     			
 		} else if(willingToTravel == 'false') { 
 			controller.set('willingToTravel', '2');
 		} else {
 			controller.set('willingToTravel', '3');
 		}

 		//Set up and select price
 		let price = catItem.get('price');
 		let minPrice = catItem.get('minPrice');
 		let maxPrice = catItem.get('maxPrice');
 		if(price){ 
 			// controller.set('maxDist', maxTravelDist);
 			controller.set('pricingOption', '1');
 			controller.set('price', price);     			
 		} else if(minPrice || maxPrice) { 
 			controller.set('pricingOption', '2');
 			controller.set('minPrice', minPrice);   
 			controller.set('maxPrice', maxPrice);   
 		} else {
 			controller.set('pricingOption', '3');
 		}
     	
     	//If province is set up, fill in
     	let province_name = catItem.get('province');
     	controller.set('selectedProvince', province_name);     	
		// let prov_code = catItem.get('provinceCode');
		// this.store.findRecord('country', 'south_africa').then((_country=>{
	 //        let provinces = _country.get('province');
	 //        provinces.forEach(function(province){
	 //        	if(province.get('code') === prov_code){
	 //        		controller.set('selectedProvince', province.get('name'));
	 //        	}
	 //        })
	 //    }));


	  },
	filepicker: Ember.inject.service(),
	actions: {
		goBack: function(){
			window.history.go(-1);
		},
		ok: function () {
			let model = this.controller.get('model.catItem');
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			let _transition = this.controller.get('tempTransition');
			switch(_modalData.get('action')) {
				case 'delete':
					model.destroyRecord().then(()=>{
						this.controller.get('model.catItem').set('isDeleting', false);
						this.transitionTo('index.vendor');
						this.controller.get('notifications').info('Item listing has been removed!',{
			                autoClear: true
			            }); 
						try{
				        	let _blob = model.get('imageBlob');
				            if(_blob){	            	
						  		this.destroyBlob(_blob);
				            } 						
						} catch(ex){}
					});

					break;


				case 'transition':
		    		this.controller.set('confirmTransition', 1);
					try{
						let _blob = model.get('imageBlob');
						let _imgurl = model.get('imageURL');
						if (_blob.url !== _imgurl){
							this.destroyBlob(_blob);
						}
					}
					catch(ex){}
					//GC for modal when transitioning
					if(_modalData){
						_modalData.deleteRecord();
					}
					this.transitionTo(_transition);
					this.controller.set('confirmTransition', 0);

					break;
			}
		},
		cancel: function (){
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			switch(_modalData.get('action')) {
				case 'delete':
					this.controller.get('model.catItem').set('isDeleting', false);

					break;


				case 'transition':

					break;
			}
		},
		destroyItem: function(){
			// let confirmation = confirm('Are you sure?');
			this.controller.get('model.catItem').set('isDeleting', true);
			let _modalData;
			if(this.controller.get('modalDataId')){
				_modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
				_modalData.set('mainMessage', 'This deletion is permeanent.');	
				_modalData.set('action', 'delete');	
            	this.send('showModal', 'modal-confirm', _modalData);	            	
            } else {
		    	let _modalData = this.store.createRecord('modal-data', {'mainMessage': 'This deletion is permeanent.', 'action': 'delete'});
		     	this.controller.set('modalDataId', _modalData.get('id'));
            	this.send('showModal', 'modal-confirm', _modalData);
            } 
	        
		},
		updateItem: function(){
			let _cat = this.controller.get('category') + "";
			let _item = this.store.peekRecord('cat-item', this.controller.get('model.catItem.id'));
			this.controller.get('model.catItem').set('isUpdating', true);

			let travelObj = this.retrieveTravelInfo();
			let priceObj = this.retrievePriceInfo();
			let provinceName = this.controller.get('selectedProvince');
			let provinceCode = this.retrieveProvinceCode(provinceName);
			_item.set('price', priceObj.price);
			_item.set('minPrice', priceObj.minPrice);
			_item.set('maxPrice', priceObj.maxPrice);
			_item.set('country', 'South Africa');
			_item.set('countryCode', 'za');
			_item.set('province', provinceName);
			_item.set('provinceCode', provinceCode);
			_item.set('willingToTravel', travelObj.willingTravel);
			_item.set('maxTravelDist', travelObj.travelDist);

			if(_cat.charAt(0) !== '<'){
				//Category has changed:
				let cat = this.store.peekRecord('category', _cat);
				let oldcatid = _item.get('category').get('id');
				let oldcat = this.store.peekRecord('category', oldcatid);
				//Update relationships
				oldcat.get('catItems').removeObject(_item);
				cat.get('catItems').pushObject(_item);
				_item.set('category', cat);

				oldcat.save().then(() => {
					cat.save().then(() => {
						_item.save().then(() => {
							this.controller.get('model.catItem').set('isUpdating', false);
							// this.tryFlushBlob(_item); //Attempt GC
				    		this.controller.get('notifications').success('Product info has been saved!',{
					            autoClear: true
					          });
						});
					});
				});
			} else {
				_item.save().then(() => {
					this.controller.get('model.catItem').set('isUpdating', false);
					this.tryFlushBlob(_item); //Attempt GC
		    		this.controller.get('notifications').success('Product info has been saved!',{
			            autoClear: true
			          });
				});
			}
		},
		willTransition(transition) {
			let model = this.controller.get('model.catItem');

			if (model.get('hasDirtyAttributes')) {
				// let confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");
				if(this.controller.get('confirmTransition') === 0) {
	    		
					let _modalData;
		            this.controller.set('tempTransition', transition.intent.name);
					transition.abort();
					if(this.controller.get('modalDataId')){
						_modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
						_modalData.set('mainMessage', 'Your changes haven\'t saved yet. Would you like to leave this form?');	
						_modalData.set('action', 'transition');	
		            	this.send('showModal', 'modal-confirm', _modalData);	            	
		            } else {
				    	let _modalData = this.store.createRecord('modal-data', {'mainMessage': 'Your changes haven\'t saved yet. Would you like to leave this form?', 'action': 'transition'});
				     	this.controller.set('modalDataId', _modalData.get('id'));
		            	this.send('showModal', 'modal-confirm', _modalData);
		            } 
					  
				} else {
					model.rollbackAttributes();
		    		this.controller.set('confirmTransition', 0);
		    	}

				
			}
	      // rollbackAttributes() removes the record from the store
	      // if the model 'isNew'
	    },
	    openFilePicker: function(){
    		let picker_options = {mimetype: 'image/*'};
    		let catItem = this.controller.get('model.catItem');
	    	this.get('filepicker.promise').then((filepicker) => {
	            //do something with filepicker
	            filepicker.pick(picker_options, function(Blob){
	            	let _imgBlob = catItem.get('imageBlob');
		            if(_imgBlob){
		            	filepicker.remove(
					      _imgBlob,
					      function(){
					        //console.log("Removed");
					      }
					    );
		            } 
	            	catItem.set('imageBlob', Blob);
	            	catItem.set('imageURL', Blob.url);
		        });
	        });
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

		    	let toGetString = "model.catItem.image" + imageSuffix;
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

	    	while(isRunning){
		    	let currentSlide = this.controller.get('currentSlide');
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

		    	let toGetString = "model.catItem.image" + imageSuffix;
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
	},
	tryFlushBlob(model){
		try{
		    let _blob = model.get('imageBlob');
		    let _imgurl = model.get('imageURL');
		    if (_blob.url !== _imgurl){
				this.destroyBlob(_blob);
		  	    //this.destroyBlob(_blob);
		    }					
		} catch(ex){}
	},
	destroyBlob(blob){

	  	this.get('filepicker.promise').then((filepicker) => {
        	filepicker.remove(
		      blob,
		      function(){
		        //console.log("Removed");
		      }
		    );
        }); 
	},
	retrieveProvinceCode: function(provinceName){
		let provinces = this.store.peekAll('province');
		provinces.forEach(function(province){
			if (province.get('name') === provinceName) {
				return province.get('code');
			}
		});
		return null;
	},
	retrieveTravelInfo: function(){
		let willingTravel;
		let travelDist;
		switch(this.controller.get('willingToTravel')){
            case '1': //Yes
                willingTravel = true;
                travelDist = this.controller.get('maxDist');
            break;

            case '2': //No
                willingTravel = false;
            break;

            default: //Na
                willingTravel = null;
            break;
        }

        return {
        	willingTravel: willingTravel, 
        	travelDist: travelDist
        };
	},
	retrievePriceInfo: function(){
		let price;
		let minPrice;
		let maxPrice;

		switch(this.controller.get('pricingOption')){
			case '1': //Fixed
                price = this.controller.get('price');
            break;

            case '2': //Range
                minPrice = this.controller.get('minPrice');
                maxPrice = this.controller.get('maxPrice');
            break;

            default: //Na
                
            break;
        }

        return {
        	price: price,
        	minPrice: minPrice,
        	maxPrice: maxPrice
        };
	},
	uiSetup: function(){
	   // do magic here...
	}.on('didInsertElement').observes('model') 
});
