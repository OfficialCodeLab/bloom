import Ember from 'ember';

const MAX_IMAGES = 5;

export default Ember.Route.extend({
	firebaseApp: Ember.inject.service(),
	storageRef: '',
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
		if(catItem.get('category')) {
 			//Load category
			let category = this.store.findRecord('category', catItem.get('category').get('id')).then((p)=>{
				controller.set('category', p);
			});
 		}

		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
        let user = this.store.peekRecord('user', _id);
  	    let vendorId = user.get('vendorAccount');

 		//If vendor is willing to travel, autopopulate
 		let willingToTravel = catItem.get('willingToTravel');
 		if(willingToTravel === 'true'){
 			controller.set('maxDist', catItem.get('maxTravelDist'));
 			controller.set('willingToTravel', '1');     			
 		} else if(willingToTravel === 'false') { 
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
     	if(catItem.get('province')) {
 			//Load province
			let province = this.store.findRecord('province', catItem.get('province').get('id')).then((p)=>{
				controller.set('province', p);
			});
 			// controller.set('province', vendor.get('province'));
 		}   	
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
						this.deleteImages();
						this.controller.get('notifications').info('Item listing has been removed!',{
			                autoClear: true
			            }); 
						
					});

					break;


				case 'transition':
		    		this.controller.set('confirmTransition', 1);
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
			let _cat = this.controller.get('category');
			let _prov = this.controller.get('province');
			let _this = this;
			let _item = this.store.peekRecord('cat-item', this.controller.get('model.catItem.id'));
			this.controller.get('model.catItem').set('isUpdating', true);

			let travelObj = this.retrieveTravelInfo();
			let priceObj = this.retrievePriceInfo();
			_item.set('price', priceObj.price);
			_item.set('minPrice', priceObj.minPrice);
			_item.set('maxPrice', priceObj.maxPrice);
			_item.set('country', 'South Africa');
			_item.set('countryCode', 'za');
			_item.set('willingToTravel', travelObj.willingTravel);
			_item.set('maxTravelDist', travelObj.travelDist);

			function checkProvince(){
			 	return new Promise(function(resolve, reject) {
					let oldprovid = _item.get('province').get('id');
					if(_prov.get('id') !== oldprovid) {
						//Province has changed:
						let prov = _this.store.peekRecord('province', _prov.get('id'));
						let oldprov = _this.store.peekRecord('province', oldprovid);
						//Update relationships
						oldprov.get('catItems').removeObject(_item);
						prov.get('catItems').pushObject(_item);
						_item.set('province', prov);
						let provinceCode = "";				
						let shortCode = prov.get('code').split('_');
						provinceCode = shortCode[1].toUpperCase();
						_item.set('provinceCode', provinceCode);

						oldprov.save().then(() => {
							prov.save().then(() => {
								resolve();
							});
						});				
					} else {
						resolve();
					}
				});
			}

			function checkCategory(){
			 	return new Promise(function(resolve, reject) {
			 		let oldcatid = _item.get('category').get('id');
					if(_cat.get('id') !== oldcatid) {
						//Category has changed:
						let cat = _this.store.peekRecord('category', _cat.get('id'));
						let oldcat = _this.store.peekRecord('category', oldcatid);
						//Update relationships
						oldcat.get('catItems').removeObject(_item);
						cat.get('catItems').pushObject(_item);
						_item.set('category', cat);
						oldcat.save().then(() => {
							cat.save().then(() => {
								resolve();
							});
						});				
					} else {
						resolve();
					}

			 	});				
			}


			Promise.all([
				checkProvince(),
				checkCategory()
			]).then(() => {
				_item.save().then(() => {
					_this.controller.get('model.catItem').set('isUpdating', false);
		    		_this.controller.get('notifications').success('Product info has been saved!',{
			            autoClear: true
			          });
				});				
			})

			
		},
		setMainImage: function(){
			let currentSlide = this.controller.get('currentSlide');
			let imageSuffix = '';
	    	if(currentSlide === 0) {
	    		imageSuffix = "URL";
	    	} else {
	    		let calcIndex = currentSlide - 1;
	    		imageSuffix = calcIndex + '';
	    	}
			let toGetString = "image" + imageSuffix;
		    if(this.controller.get("model.catItem."+toGetString)){
				let model = this.controller.get('model.catItem');
		    	let oldImage = model.get(toGetString);
		    	let oldMain = model.get('imageURL');
				model.set('imageURL', oldImage);
				model.set(toGetString, oldMain);
	          	this.setImageSlide(0);
				model.save().then(()=>{
					this.controller.get('notifications').success('Main Image has been updated',{
		            	autoClear: true
		          	});
				});
		    } else {
		    	this.controller.get('notifications').error('Image could not be used',{
	            	autoClear: true
	          	});
		    }

		},
		showUploader: function() {
			this.controller.set("showImageUploader", true);
		},
		cancelUpload: function () {
			this.controller.set("showImageUploader", false);
			var selectedImage = document.getElementById('selectedImage');
    		selectedImage.src = null;
		},
		uploadImage: function() {
			var selectedImage = document.getElementById('selectedImage');
			if(!(!selectedImage.complete || typeof selectedImage.naturalWidth === "undefined" || selectedImage.naturalWidth === 0)) {

				this.controller.set("isUploading", true);
				let currentSlide = this.controller.get('currentSlide');
				let imageSuffix = '';
				let imageName = "";
		    	if(currentSlide === 0) {
		    		imageSuffix = "URL";
		    		imageName = "mainImg";
		    	} else {
		    		let calcIndex = currentSlide - 1;
		    		imageSuffix = calcIndex + '';
		    		imageName = "image" + calcIndex;
		    	}
				let toGetString = "image" + imageSuffix;

				let mainI = this.decodeImage(selectedImage);
				let tasksComplete = 0;
				let tasksToDo = 0;
				let _this = this;

				//Still all under assumption it is loaded

		    	var metadata = {
					contentType: mainI.contentType
				};

				var storageRef = this.get('firebaseApp').storage().ref();
				let _id = this.get("session").get('currentUser').providerData[0].uid + "";
				let user = this.store.peekRecord('user', _id);
				let catItem = this.controller.get('model.catItem');
				let itemId = catItem.get('id');
				let vendorId = user.get('vendorAccount');

				//Should locally store all variables
				var path = 'vendorImages/' + vendorId + '/services/' + itemId + '/';
				var uploadTask = storageRef.child(path + imageName).put(mainI.blob, metadata);

				uploadTask.on('state_changed', function(snapshot){
					//PROGRESS
					var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					// console.log('Upload is ' + progress + '% done');
					// console.log(snapshot.state);
				}, function(error) {
					_this.controller.set("isUploading", false);
					_this.controller.get('notifications').error('Something went wrong, please try again.',{
			            autoClear: true
			        }); 
					//ERROR
				}, function() {
					//COMPLETE
					var downloadURL = uploadTask.snapshot.downloadURL;
					//Add image
					let catItem = _this.store.peekRecord('cat-item', itemId);
					catItem.set(toGetString, downloadURL);
					catItem.save().then(()=>{
						_this.controller.get('notifications').success('Image uploaded successfully!',{
				            autoClear: true
				        }); 

						_this.controller.set("isUploading", false);						
						_this.controller.set("showImageUploader", false);
			    		selectedImage.src = null;
					});
				});

			} else {
				this.controller.get('notifications').error('Please select an image',{
		            autoClear: true
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

		    	// let toGetString = "model.catItem.image" + imageSuffix;
		    	// if(this.controller.get(toGetString)){
		    		this.setImageSlide(currentSlide);
		    		isRunning = false;
		    	// } else {
		    	// 	breakThis++;
		    	// 	if(breakThis >= 4){
		    	// 		isRunning = false;
		    	// 	}
		    	// }
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

		    	// let toGetString = "model.catItem.image" + imageSuffix;
		    	// if(this.controller.get(toGetString)){
		    		this.setImageSlide(currentSlide);
		    		isRunning = false;
		    	// } else {
		    	// 	breakThis++;
		    	// 	if(breakThis >= 4){
		    	// 		isRunning = false;
		    	// 	}
		    	// }	    		
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
                if (travelDist === 0){
                	travelDist = 1;
                }
            break;

            case '2': //No
                willingTravel = false;
            break;

            default: //Na
                willingTravel = true;
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
	deleteImages: function(){
		var storageRef = this.get('firebaseApp').storage().ref();
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		let user = this.store.peekRecord('user', _id);
		let catItem = this.controller.get('model.catItem');
		let itemId = catItem.get('id');
		let vendorId = user.get('vendorAccount');
	    var _ref = 'vendorImages/' + vendorId + '/services/' + itemId;
	    var mainRef = storageRef.child(_ref + '/mainImg');

	    // Delete the file
	    mainRef.delete().then(function() { // File deleted successfully
	    }).catch(function(error) { // Uh-oh, an error occurred!
		     console.log(error);
	    });

	    if(catItem.get('image0')){
	    	var ref0 = storageRef.child(_ref+'/image0');
		    ref0.delete().then(function() { // File deleted successfully
		    }).catch(function(error) { // Uh-oh, an error occurred!
		      console.log(error);
		    });
	    }

	    if(catItem.get('image1')){
	    	var ref1 = storageRef.child(_ref+'/image1');
		    ref1.delete().then(function() { // File deleted successfully
		    }).catch(function(error) { // Uh-oh, an error occurred!
		      console.log(error);
		    });
	    }

	    if(catItem.get('image2')){
	    	var ref2 = storageRef.child(_ref+'/image2');
		    ref2.delete().then(function() { // File deleted successfully
		    }).catch(function(error) { // Uh-oh, an error occurred!
		      console.log(error);
		    });
	    }

	    if(catItem.get('image3')){
	    	var ref3 = storageRef.child(_ref+'/image2');
		    ref3.delete().then(function() { // File deleted successfully
		    }).catch(function(error) { // Uh-oh, an error occurred!
		      console.log(error);
		    });
	    }

	    if(catItem.get('image4')){
	    	var ref4 = storageRef.child(_ref+'/image2');
		    ref4.delete().then(function() { // File deleted successfully
		    }).catch(function(error) { // Uh-oh, an error occurred!
		      console.log(error);
		    });
	    }
	},
	b64toBlob: function(b64Data, contentType, sliceSize) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
		  byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, {type: contentType});
		return blob;
	},
	//Returns JSON struct with decoded blob, extension and content type
	decodeImage: function(image){
		let blob = image.src;
		let _blob = blob.split(",", 2);
		let _metadata = _blob[0].split(';', 2);
		let fileType = _metadata[0].split(':', 2);
		let contentType = fileType[1];
		let __blob = this.b64toBlob(_blob[1]);
		let ext = fileType[1].split('/', 2);

		let decodedImage = {
			contentType: contentType,
			extension: ext[1],
			blob: __blob
		};

		return decodedImage;
	},
	uiSetup: function(){
	   // do magic here...
	}.on('didInsertElement').observes('model')
});
