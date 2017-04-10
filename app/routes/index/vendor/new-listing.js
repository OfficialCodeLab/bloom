 import Ember from 'ember';

 const PAGE_COUNT = 3;

export default Ember.Route.extend({

	beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
          }

      	  let _id = this.get("session").get('currentUser').providerData[0].uid + "";
          let user = this.store.peekRecord('user', _id);
          if(!user.get('vendorAccount')){
          	this.transitionTo('index.vendor.login');
          }

          return sesh;
    },
    model(params) {

        return Ember.RSVP.hash({
            province: this.store.findRecord('country', 'south_africa').then((_country=>{
                return _country.get('province');
            })),
            category: this.store.findAll('category')
        });
    	// return this.store.findAll('category');
    },
	setupController: function (controller, model) {
     	this._super(controller, model);
        Ember.set(controller, 'province', model.province);
        Ember.set(controller, 'category', model.category);
  	    let _id = this.get("session").get('currentUser').providerData[0].uid + "";
        let user = this.store.peekRecord('user', _id);
  	    let vendorId = user.get('vendorAccount');
     	this.store.findRecord('vendor-stat', vendorId).then((vs)=>{

     		//If vendor is willing to travel, autopopulate
     		let willingToTravel = vs.get('willingToTravel');
     		if(willingToTravel === 'true'){
     			let maxTravelDist = vs.get('maxTravelDist');
     			controller.set('maxDist', maxTravelDist);
     			controller.set('willingToTravel', '1');     			
     		} else if(willingToTravel === 'false') { 
     			controller.set('willingToTravel', '2');
     		} else {
     			controller.set('willingToTravel', '3');
     		}

     		//If vendor has selected one category, auto select it for them
     		let categories = vs.get('categories');
     		let cats = [];

     		categories.forEach(function(cat){
     			cats.push(cat);
     		});
     		if(cats.length === 1){
     			controller.set('category', cats[0]);
     		} 

			this.store.findRecord('vendor', vendorId).then((vendor)=>{
	     		//If auto listing, fill in description
	     		if(controller.get('isAutoListing') === 'true') {
	     			controller.set('desc', vs.get('servicesDesc'));

	     				controller.set('name', vendor.get('name'));

	     				//Refresh fields
	     				controller.set('refreshFields', false);
	     				Ember.run.next(function () {
	     					controller.set('refreshFields', true);
					    });
	     		} 

     			//If province is set up, fill in
	     		if(vendor.get('province')) {
	     			//Load province
     				let province = this.store.findRecord('province', vendor.get('province').get('id')).then((p)=>{
     					controller.set('province', p);
     				});
	     			// controller.set('province', vendor.get('province'));
	     		}

	     		if(vendor.get('city')) {
	     			controller.set('city', vendor.get('city'));
	     			//Refresh fields
     				controller.set('refreshFields', false);
     				Ember.run.next(function () {
     					controller.set('refreshFields', true);
				    });
	     		}
	     	});
     	}, ()=> {});
	},
	filepicker: Ember.inject.service(),
	firebaseApp: Ember.inject.service(),
	storageRef: '',
	file: '',
	itemId: 'imageDump',
	uploadsComplete: false,
	listingCreated: false,
    actions: {
		goBack: function(){
			window.history.go(-1);
		},

        nextSection() {
            let section = this.controller.get('currentSection');
            section++;
            this.setSection(section);

        },
        prevSection() {
            let section = this.controller.get('currentSection');
            section--;
            this.setSection(section);

        },

    	ok: function() {
			let _transition = this.controller.get('tempTransition');

			//GC for modal when transitioning
			let modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			if(modalData){
				modalData.deleteRecord();
			}

	    	let _blob = this.controller.get('imgBlob');
    		this.controller.set('name', '');
			this.controller.set('price', '');
			this.controller.set('desc', '');
			this.controller.set('city', '');
			this.controller.set('imageURL', '');
			this.controller.set('imgBlob', '');
			this.controller.set('minPrice', '');
			this.controller.set('maxPrice', '');
			this.setSection(1);
			this.controller.set('pricingOption', '3');
			this.controller.set('isCreating', false);
			this.controller.set('tempTransition', '');
			this.controller.set('confirmTransition', 1);


			if(_blob){		
		    	this.destroyBlob(_blob);    
			}
			// console.log(_transition);
			this.transitionTo(_transition);
			this.controller.set('confirmTransition', 0);

    	},
    	openFilePicker: function(){
    		let picker_options = {mimetype: 'image/*'};
    		let _that = this;
	    	this.get('filepicker.promise').then((filepicker) => {
	            //do something with filepicker
	            filepicker.pick(picker_options, function(Blob){
	            	let _imgBlob = _that.controller.get('imgBlob');
		            if(_imgBlob){
		            	filepicker.remove(
					      _imgBlob,
					      function(){
					        //console.log("Removed");
					      }
					    );
		            } 
	            	_that.controller.set('imgBlob', Blob);
	            	_that.controller.set('imageURL', Blob.url);
		        });
	        });
	    },
	    willTransition(transition){
	    	// let _blob = this.controller.get('imgBlob');
	    		// console.log("TEST" + this.controller.get('itemCreated'));
	    	if(this.isItemCreated()){
	    		// console.log(this.controller.get('itemCreated'));
	    		if(this.controller.get('confirmTransition') === 0) {
		            this.controller.set('tempTransition', transition.intent.name);
		            transition.abort();
		            let _modalData;
		            let modalDataId;
		            if(this.controller.get('modalDataId')){
						_modalData = this.store.peekRecord('modal-data', this.controller.get('modaDataId'));	
		            	this.send('showModal', 'modal-confirm', _modalData);	            	
		            } else {
				    	let _modalData = this.store.createRecord('modal-data', {'mainMessage': "You have unsaved changes."});
				     	this.controller.set('modalDataId', _modalData.get('id'));
		            	this.send('showModal', 'modal-confirm', _modalData);
		            }    
					// let modalData = this.store.peekRecord('modelDataId', this.controller.get('modalDataId'));  
		            // this.controller.set('tempTransition', transition);
	    		} else {
	    			this.controller.set('confirmTransition', 0);
	    		}

	            // transition.abort();
	            // this.controller.set('tempTransition', transition);
	            // this.sendAction('showModal');
	    		// let confirmation = confirm("Your item hasn't been created yet, are you sure you want to leave this form?");

		     //    if (confirmation) {
							// this.controller.set('name', '');
							// this.controller.set('price', '');
							// this.controller.set('desc', '');
							// this.controller.set('imageURL', '');
							// this.controller.set('imgBlob', '');
							// this.controller.set('isCreating', false);

			    // 	if(_blob){		
		     //        	this.destroyBlob(_blob);    
			    // 	}
		    	// } else {
			    //       transition.abort();
		     //    }	    		
	    	} 
	    	// else {
	    	// 	this.controller.set('itemCreated', true);
	    	// }
	    },
		createItem(){
			try{
				this.controller.set('isCreating', true);
				let cat = this.controller.get('category');
				let _id = this.get("session").get('currentUser').providerData[0].uid + "";
				let user = this.store.peekRecord('user', _id);
				let _blob = this.controller.get('imgBlob');
				let _imgurl = this.controller.get('imageURL');
				let province = this.controller.get('province');
				let provinceCode = "";				
				let shortCode = province.get('code').split('_');
				provinceCode = shortCode[1].toUpperCase();

				var mainImg = document.getElementById('mainImg');

				this.store.findRecord('vendor', user.get('vendorAccount')).then((vndr) => {
					let itemsC = vndr.get("catItems.length");
					itemsC = parseInt(itemsC) + 1;
					let maxCount = parseInt(vndr.get("maxItems"));

					if(!maxCount || maxCount > itemsC){
						if(!(!mainImg.complete || typeof mainImg.naturalWidth === "undefined" || mainImg.naturalWidth === 0)){
							if(this.controller.get('name')) {
								let travelObj = this.retrieveTravelInfo();
								let priceObj = this.retrievePriceInfo();
								let newItem = this.store.createRecord('cat-item', {		
								  name: this.controller.get('name'),			
								  desc: this.controller.get('desc'),			
								  price: priceObj.price,		
								  minPrice: priceObj.minPrice,		
								  maxPrice: priceObj.maxPrice,
								  city: this.controller.get('city'),
								  country: 'South Africa',
								  countryCode: 'za',
								  province: province,
								  provinceCode: provinceCode,
								  willingToTravel: travelObj.willingTravel,
								  maxTravelDist: travelObj.travelDist,
								  category: cat,
								  vendor: vndr
								});
								this.set('itemId', newItem.get('id'));
								this.uploadAllFiles();
								newItem.save().then(()=>{
									cat.get('catItems').pushObject(newItem);
									cat.save().then(()=>{
										province.get('catItems').pushObject(newItem);
										province.save().then(()=>{
											vndr.get('catItems').pushObject(newItem);
											vndr.save().then(()=>{		 
												this.controller.set('itemCreated', true);
												this.set('listingCreated', true);

												if(this.get('uploadsComplete') === true && this.controller.get('isCreating') === true) {
													this.completeListing();
												}
											});											
										});	
									});	
								});	

							} else {
								this.controller.set('isCreating', false);
								this.controller.get('notifications').error('Please enter a name for your listing',{
					                autoClear: true
					            });  							
							}						
						} else {
							this.controller.set('isCreating', false);
							this.controller.get('notifications').error('Please select a main image for your listing.',{
				                autoClear: true
				            });  							
						}
					} else {
						this.controller.set('isCreating', false);
						this.controller.get('notifications').error('You have reached maximum listings.\nPlease upgrade your plan to post more.',{
			                autoClear: true
			            });  
					}

					
				});
			} catch(ex){
				this.controller.set('isCreating', false);
				this.controller.get('notifications').error('Please select a category or there was a problem.',{
	                autoClear: true
	            }); 
			}
		}
	},
	isItemCreated(){
		 if(this.controller.get('name') || this.controller.get('price') || this.controller.get('desc') || this.controller.get('imageURL')){
			return true;
		}	

		return false;

	},

	    uploadAllFiles: function(){
	    	// let blob = this.controller.get('mainImageBlob');
			var mainImg = document.getElementById('mainImg');
			var img1 = document.getElementById('img1');
			var img2 = document.getElementById('img2');
			var img3 = document.getElementById('img3');
			var img4 = document.getElementById('img4');
			var img5 = document.getElementById('img5');
			var imagesArr = [img1, img2, img3, img4, img5];
			let mainI = this.decodeImage(mainImg);
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
			let itemId = this.get('itemId');
			let vendorId = user.get('vendorAccount');
			//PATH : userId / catItems / filename
			//Should locally store all variables
			var path = 'vendorImages/' + vendorId + '/services/' + itemId + '/';
			var uploadTask = storageRef.child(path + "mainImg").put(mainI.blob, metadata);
			tasksToDo++;

			let uploadTasks = [];

			for (var i = 0; i < 5; i++){
				if(!(!imagesArr[i].complete || typeof imagesArr[i].naturalWidth === "undefined" || imagesArr[i].naturalWidth === 0)){
					let im = this.decodeImage(imagesArr[i]);
					let met = {
						contentType: im.contentType
					};
					let newUpload = storageRef.child(path + "image" + i).put(im.blob, met);
					uploadTasks.push(newUpload);
					tasksToDo++;
				}
			}

			uploadTask.on('state_changed', function(snapshot){
				//PROGRESS
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				// console.log('Upload is ' + progress + '% done');
				// console.log(snapshot.state);
			}, function(error) {
				//ERROR
			}, function() {
				//COMPLETE
				var downloadURL = uploadTask.snapshot.downloadURL;
				// alert(downloadURL);
				// console.log(downloadURL);
				tasksComplete++;
				console.log(tasksComplete + " / " + tasksToDo + " tasks complete");
				//Add main image
				let catItem = _this.store.peekRecord('cat-item', itemId);
				catItem.set('imageURL', downloadURL);
				catItem.save().then(()=>{
					if(tasksComplete === tasksToDo){					
						_this.set('uploadsComplete', true);
						// console.log("Complete");

						if(_this.get('listingCreated') === true && _this.controller.get('isCreating') === true) {
							_this.completeListing();
						}
					}
				});
			});

			/* jshint ignore:start */
			for (var j = 0; j < uploadTasks.length; j++) {
				//TODO: handle all other uploads
				//Possibly change observable property and complete when done
				let upload = uploadTasks[j];
				let imageNum = "image" + j;
				upload.on('state_changed', function(snapshot){
				//PROGRESS
					var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					// console.log('Upload is ' + progress + '% done');
					// console.log(snapshot.state);
				}, function(error) {
					//ERROR
				}, function() {
					//COMPLETE
					var downloadURL = upload.snapshot.downloadURL;
					// alert(downloadURL);
					// console.log(downloadURL);
					tasksComplete++;
					console.log(tasksComplete + " / " + tasksToDo + " tasks complete");
					let catItem = _this.store.peekRecord('cat-item', itemId);
					catItem.set(imageNum, downloadURL);
					catItem.save().then(()=>{
						if(tasksComplete === tasksToDo){					
							_this.set('uploadsComplete', true);
							// console.log("Complete");

							if(_this.get('listingCreated') === true && _this.controller.get('isCreating') === true) {
								_this.completeListing();
							}
						}
					});
				});
			}
			/* jshint ignore:end */
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

    setSection: function(x){
        this.controller.set('currentSection', x);

        switch(x){
            case 1:
                this.controller.set('section1', true);
                this.controller.set('section2', false);
                this.controller.set('section3', false);
            break;

            case 2:
                this.controller.set('section1', false);
                this.controller.set('section2', true);
                this.controller.set('section3', false);
            break;

            case 3:
                this.controller.set('section1', false);
                this.controller.set('section2', false);
                this.controller.set('section3', true);
            break;

            case 4:
                this.controller.set('section1', false);
                this.controller.set('section2', false);
                this.controller.set('section3', false);
                this.controller.set('section4', true);
                window.scrollTo(0, 200);
            break;
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
	completeListing: function(){
		this.controller.set('name', '');
		this.controller.set('price', '');
		this.controller.set('minPrice', '');
		this.controller.set('maxPrice', '');
		this.controller.set('pricingOption', '3');
		this.controller.set('desc', '');
		this.controller.set('imageURL', '');
		this.setSection(1);
        this.controller.set('isCreating', false);
    	this.controller.get('notifications').info('Listing created successfully!',{
            autoClear: true
        }); 
        this.transitionTo('index.vendor');
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
	}
});
