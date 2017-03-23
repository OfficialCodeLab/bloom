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
			img.src = dataURL;

			img.onload = function() {
	            var w = this.width,
	                h = this.height,
	                t = file.type,                           // ext only: // file.type.split('/')[1],
	                n = file.name,
	                s = ~~(file.size/1024) +'KB';
		            if(w < h) {
		            	errorFunc();
		            	this.src = null;
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
			img.src = dataURL;

			img.onload = function() {
	            var w = this.width,
	                h = this.height,
	                t = file.type,                           // ext only: // file.type.split('/')[1],
	                n = file.name,
	                s = ~~(file.size/1024) +'KB';
		            if(w/h !== 1) {
		            	errorFunc();
			        	this.src = null;
			        }         
	        };
	        
		});
		 //debugger;
		reader.readAsDataURL(file);
		 //debugger;
		 
    }

});
