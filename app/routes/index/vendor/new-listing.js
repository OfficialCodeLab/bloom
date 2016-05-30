import Ember from 'ember';

export default Ember.Route.extend({

	beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
          }

      	  let _id = this.get("session").content.currentUser.id + "";
          let user = this.store.peekRecord('user', _id);
          if(!user.get('vendorAccount')){
          	this.transitionTo('index.vendor.login');
          }

          return sesh;
    },
    model() {
    	return this.store.findAll('category');
    },
	filepicker: Ember.inject.service(),
    actions: {
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
	    	let _blob = this.controller.get('imgBlob');
	    	if(!this.controller.get('itemCreated')){
	    		let confirmation = confirm("Your item hasn't been created yet, are you sure you want to leave this form?");

		        if (confirmation) {
							this.controller.set('name', '');
							this.controller.set('price', '');
							this.controller.set('desc', '');
							this.controller.set('imageURL', '');
							this.controller.set('imgBlob', '');
							this.controller.set('isCreating', false);

			    	if(_blob){		
		            	this.destroyBlob(_blob);    
			    	}
		    	} else {
			          transition.abort();
		        }	    		
	    	} else {
	    		this.controller.set('itemCreated', false);
	    	}
	    },
		createItem(){
			try{
				this.controller.set('isCreating', true);
				let cat = this.store.peekRecord('category', this.controller.get('category'));
				let _id = this.get("session").content.currentUser.id + "";
				let user = this.store.peekRecord('user', _id);
				let _blob = this.controller.get('imgBlob');
				let _imgurl = this.controller.get('imageURL');
				this.store.findRecord('vendor', user.get('vendorAccount')).then((vndr) => {
					let newItem = this.store.createRecord('cat-item', {				
					  name: this.controller.get('name'),			
					  desc: this.controller.get('desc'),			
					  price: this.controller.get('price'),
					  category: cat,
					  vendor: vndr,
					  imageBlob: _blob,
					  imageURL: _imgurl
					});
					newItem.save().then(()=>{
						cat.get('catItems').pushObject(newItem);
						cat.save().then(()=>{		
							vndr.get('catItems').pushObject(newItem);
							vndr.save().then(()=>{
								this.controller.set('name', '');
								this.controller.set('price', '');
								this.controller.set('desc', '');
								this.controller.set('imageURL', '');
								this.controller.set('isCreating', false);
								this.controller.set('imgBlob', '');
								this.controller.set('itemCreated', true);
								if(_blob.url !== _imgurl){
						            if(_blob){
						            	this.destroyBlob(_blob);
						            } 
						    	}
								this.transitionTo('index.vendor');
							});
						});	
					});
				});
			} catch(ex){
				this.controller.set('isCreating', false);
				alert("Please select a category or there was a problem");
			}
		}
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
});
