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
    section1: true,
    currentSection: 1,
    refreshFields: true,
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
	willingToTravel: 0,
    willTravel: Ember.computed.equal('willingToTravel', '1'),
    pricingOption: '3',
    maxDist: 1,
    province: '',
    isFixedPrice: Ember.computed.equal('pricingOption', '1'),
    isRangePrice: Ember.computed.equal('pricingOption', '2'),
    queryParams: ['isAutoListing'],
  	isAutoListing: null,
	// willTravel: Ember.computed('willingToTravel', function() {
	// 	if(${this.get('firstName')} === 1){
	// 		return true
	// 	}
	//     return false;
 //    }),
    actions: {
    	selectCat(value){
			this.set('category', value);
		}
    },

	addedFile: function(file) {
        console.log('added: ', file, this);
        // alert(file.type);s
        alert(file.name);
        //UPLOAD TO FIREBASE STORAGE
    },

    removeExtraImage: function(file, done){
    	let reader = new FileReader();

    	reader.onloadend = Ember.run.bind(this, function(){
    		var dataURL = reader.result;
    		var img1 = document.getElementById('img1');
    		var img2 = document.getElementById('img2');
    		var img3 = document.getElementById('img3');
    		var img4 = document.getElementById('img4');
    		var img5 = document.getElementById('img5');
    		if(img1.src === dataURL) {
    			img1.src = null;
    		} else if (img2.src === dataURL) {
    			img2.src = null;
    		} else if (img3.src === dataURL) {
    			img3.src = null;
			} else if (img4.src === dataURL) {
    			img4.src = null;
			} else if (img5.src === dataURL) {
    			img5.src = null;
			}
    	});

    	reader.readAsDataURL(file);

    },

    storeExtraImage: function(file, done){
    	// console.log(file);
    	let _this = this;
    	let _file = file;

    	let reader = new FileReader();
    	reader.onloadend = Ember.run.bind(this, function(){
			var dataURL = reader.result;
          var canvas = document.createElement('canvas');
    		var img1 = document.getElementById('img1');
    		var img2 = document.getElementById('img2');
    		var img3 = document.getElementById('img3');
    		var img4 = document.getElementById('img4');
    		var img5 = document.getElementById('img5');
        var img;
			if(!img1.complete || typeof img1.naturalWidth === "undefined" || img1.naturalWidth=== 0){
				img1.src = dataURL;
        img = img1;
			} else if (!img2.complete || typeof img2.naturalWidth === "undefined" || img2.naturalWidth === 0) {
				img2.src = dataURL;
        img = img2;
			} else if (!img3.complete || typeof img3.naturalWidth === "undefined" || img3.naturalWidth === 0) {
				img3.src = dataURL;
        img = img3;
			} else if (!img4.complete || typeof img4.naturalWidth === "undefined" || img4.naturalWidth === 0) {
				img4.src = dataURL;
        img = img4;
			} else if (!img5.complete || typeof img5.naturalWidth === "undefined" || img5.naturalWidth === 0) {
				img5.src = dataURL;
        img = img5;
			}
        var int32View = new Int32Array(dataURL);
        var mimeType;
        switch(int32View[0]) {
            case 1196314761:
                mimeType = "image/png";
                break;
            case 944130375:
                mimeType = "image/gif";
                break;
            case 544099650:
                mimeType = "image/bmp";
                break;
            case -520103681:
                mimeType = "image/jpg";
                break;
            default:
                mimeType = "unknown";
                break;
        }

        img.onload = function() {
            var MAX_WIDTH = 1000;
            var MAX_HEIGHT = 1200;
            var width = this.width;
            var height = this.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
                sizeExceeds(this, width, height);
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
                sizeExceeds(this, width, height);
              }
            }

            function sizeExceeds(that, width, height) {
                var imageCompressor = new ImageCompressor();

                var compressorSettings = {
                    toWidth : width,
                    toHeight : height,
                    mimeType : mimeType,
                    mode : 'strict',
                    quality : 0.6,
                    speed : 'low'
                };

                imageCompressor.run(that.src, compressorSettings, proceedCompressedImage);

                function proceedCompressedImage (compressedSrc) {
                  that.src = compressedSrc;
                }
            }
          };

    	});
		reader.readAsDataURL(file);

    },

    removeMainImage: function(file, done){
    	var mainImg = document.getElementById('mainImg');
    	mainImg.src = null;
    },

    storeMainImage: function(file, done){
        let _this = this;
    		let _file = file;
    		let reader = new FileReader();

    		reader.onloadend = Ember.run.bind(this, function(){
    			var dataURL = reader.result;
    			var mainImg = document.getElementById('mainImg');
          var canvas = document.createElement('canvas');
    			mainImg.src = dataURL;
          var int32View = new Int32Array(dataURL);
          var mimeType;
          switch(int32View[0]) {
              case 1196314761:
                  mimeType = "image/png";
                  break;
              case 944130375:
                  mimeType = "image/gif";
                  break;
              case 544099650:
                  mimeType = "image/bmp";
                  break;
              case -520103681:
                  mimeType = "image/jpg";
                  break;
              default:
                  mimeType = "unknown";
                  break;
          }
          mainImg.onload = function() {
            var MAX_WIDTH = 1000;
            var MAX_HEIGHT = 1200;
            var width = this.width;
            var height = this.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
                sizeExceeds(this, width, height);
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
                sizeExceeds(this, width, height);
              }
            }

            function sizeExceeds(that, width, height) {
                var imageCompressor = new ImageCompressor();

                var compressorSettings = {
                    toWidth : width,
                    toHeight : height,
                    mimeType : mimeType,
                    mode : 'strict',
                    quality : 0.6,
                    speed : 'low'
                };

                imageCompressor.run(that.src, compressorSettings, proceedCompressedImage);

                function proceedCompressedImage (compressedSrc) {
                  that.src = compressedSrc;
                }
            }

          };
    		});
    		 //debugger;
    		reader.readAsDataURL(file);
		 //debugger;
    }
});
