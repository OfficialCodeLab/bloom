import Ember from 'ember';

export default Ember.Route.extend({

	firebaseApp: Ember.inject.service(),

	actions : {
		uploadBrandImg: function () {
			this.uploadImg("brandImage");
		},
		uploadBackImg: function () {
			this.uploadImg("backgroundImage");
		}
	},

	uploadImg: function(id){

		var img = document.getElementById(id);
		let mainI = this.decodeImage(img);
		let _this = this;
		let uploadingId = "uploading" + id.charAt(0).toUpperCase() + id.slice(1);
		this.controller.set(uploadingId, true);

    	var metadata = {
			contentType: mainI.contentType
		};

		var storageRef = this.get('firebaseApp').storage().ref();
		let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
		let user = this.store.peekRecord('user', _id);
		let vendorId = user.get('vendorAccount').get('id');
		//PATH : userId / branding
		//Should locally store all variables
		var path = 'vendorImages/' + vendorId + '/branding/';
		var uploadTask = storageRef.child(path + id).put(mainI.blob, metadata);
		
		uploadTask.on('state_changed', function(snapshot){
			//PROGRESS
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			// console.log('Upload is ' + progress + '% done');
			// console.log(snapshot.state);
		}, function(error) {
			//ERROR
        _this.controller.get('notifications').error('There was a problem uploading your images, please try again.',{
            autoClear: true
        }); 
		}, function() {
			//COMPLETE
			var downloadURL = uploadTask.snapshot.downloadURL;
			// alert(downloadURL);

			_this.store.findRecord("vendor", vendorId).then((v)=>{
				// let setString = "background: url("+downloadURL+");";
				v.set(id, downloadURL);
				v.save().then(()=>{
					_this.controller.get('notifications').success('Image uploaded successfully!',{
			            autoClear: true
			        }); 

					_this.controller.set(uploadingId, false);
				});
			});
		});

		
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
});
