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
    maxDist: 0,
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

    storeExtraImage: function(file, done){
    	// console.log(file);
    	let _file = file;

    	let reader = new FileReader();

    	reader.onloadend = Ember.run.bind(this, function(){
			var dataURL = reader.result;
			var img1 = document.getElementById('img1');
			if(img1.src){
				var img2 = document.getElementById('img2');
				if(img2.src){
					var img3 = document.getElementById('img3');
					if(img3.src){
						// Simple handling for now.
						// Need to figure out image removal
					} else {
						img3.src = dataURL;
					}
				} else {
					img2.src = dataURL;
				}
			} else {
				img1.src = dataURL;
			}
    	});
		reader.readAsDataURL(file);

    },

    storeMainImage: function(file, done){
        console.log(file);
		let _file = file;

		let reader = new FileReader();

		reader.onloadend = Ember.run.bind(this, function(){
			var dataURL = reader.result;
			var mainImg = document.getElementById('mainImg');
			mainImg.src = dataURL;
		});
		 //debugger;
		reader.readAsDataURL(file);
		 //debugger;
		 

    //     return new Promise(function(resolve, reject){
		  //   var _xhr = file.get('xhr');
		  //   _xhr.onreadystatechange = handler;
		  //   _xhr.send();

		  //   function handler() {
		  //     if (this.readyState === this.DONE) {
		  //       if (this.status === 200) {
		  //         resolve(console.log(file.status));
		  //       } else {
		  //         reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
		  //       }
		  //     }
		  //   };
		  // });
// file.done((response)=>{
// 	console.log("TEST");
// });
        // while(file.status !== "success"){

        // }
         // file.xhr.onload = () => {
         // 	console.log(file.status);
         // };
        // console.log(file.contents);
    },
});
