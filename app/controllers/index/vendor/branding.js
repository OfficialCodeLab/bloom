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

			img.onload = function() {
            var MAX_WIDTH = 1000;
            var width = this.width;
            var height = this.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
                sizeExceeds(this);
              }
            } else {
            	errorFunc();
            }

            function sizeExceeds(that) {
              canvas.width = width;
              canvas.height = height;
              var ctx = canvas.getContext("2d");
              ctx.drawImage(that, 0, 0, width, height);

              var dataurl = canvas.toDataURL("image/jpg");  
              that.src = dataurl;                    
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

			img.onload = function() {
          var MAX_WIDTH = 1500;
          var MAX_HEIGHT = 1500;
          var width = this.width;
          var height = this.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
              sizeExceeds(this);
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
              sizeExceeds(this);
            }
          }

          function sizeExceeds(that) {
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(that, 0, 0, width, height);

            var dataurl = canvas.toDataURL("image/jpg");  
            that.src = dataurl;                    
          }	      
        };
        
		});
		 //debugger;
		reader.readAsDataURL(file);
		 //debugger;
		 
    }

});
