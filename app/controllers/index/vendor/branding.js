import Ember from 'ember';


export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),

    storeBackgroundImage: function(file, done){
        console.log(file);
		let _file = file;
		let _this = this;

		let reader = new FileReader();

		let errorFunc = function() {
            _this.dropzone.removeFile(file);
        	alert("Aspect ratio is incorrect.\nPlease ensure the width is greater than the height");
		};	

		reader.onloadend = Ember.run.bind(this, function(){
			var dataURL = reader.result;
			var img = document.getElementById('backgroundImage');
      var canvas = document.createElement('canvas');
			img.src = dataURL;
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
            var width = this.width;
            var height = this.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
                sizeExceeds(this, width, height);
              }
            } else {
            	errorFunc();
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
		 
    },

     storeBrandImage: function(file, done){
        console.log(file);
		let _file = file;
		let _this = this;

		let reader = new FileReader();

		let errorFunc = function() {
            _this.dropzone.removeFile(file);
        	alert("Aspect ratio is incorrect.\nPlease ensure it is 1x1 (square)");
		};		

		reader.onloadend = Ember.run.bind(this, function(){
			var dataURL = reader.result;
			var img = document.getElementById('brandImage');
      var canvas = document.createElement('canvas');
			img.src = dataURL;
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
          var MAX_WIDTH = 1500;
          var MAX_HEIGHT = 1500;
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
