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
    maxDist: 1,
    province: '',
    isFixedPrice: Ember.computed.equal('pricingOption', '1'),
    isRangePrice: Ember.computed.equal('pricingOption', '2'),
	showImageUploader: false,
	img0: true,
    img1: false,
    img2: false,
    img3: false,
    img4: false,
    img5: false,
    currentSlide: 0,
    currentSlideCalc: Ember.computed('currentSlide', function() {
	    return `${this.get('currentSlide') + 1}`;
    }),
    actions: {
    	selectCat(){
		},
    },
    removeImage: function(file, done){
    	var selectedImage = document.getElementById('selectedImage');
    	selectedImage.src = null;
    },

    storeImage: function(file, done){
        let _this = this;
		let _file = file;

		let reader = new FileReader();
    let errorFunc = function() {
        _this.dropzone.removeFile(file);
      alert("Image size too large, please ensure the file size is less than 400kb");
    }; 

		reader.onloadend = Ember.run.bind(this, function(){
			var dataURL = reader.result;
      var canvas = document.createElement('canvas');
			var selectedImage = document.getElementById('selectedImage');
			selectedImage.src = dataURL;
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
      
      selectedImage.onload = function() {
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
	}
});
