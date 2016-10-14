import Ember from 'ember';

export default Ember.Route.extend({

	model(params){
		return Ember.RSVP.hash({
	    	catItem: this.store.findRecord('catItem', params.catItem_id),
			category: this.store.findAll('category')
	    });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    Ember.set(controller, 'catItem', model.catItem);
	    Ember.set(controller, 'category', model.category);
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
						try{
				        	let _blob = model.get('imageBlob');
				            if(_blob){	            	
						  		this.destroyBlob(_blob);
				            } 						
						} catch(ex){}
					});

					break;


				case 'transition':
		    		this.controller.set('confirmTransition', 1);
					try{
						let _blob = model.get('imageBlob');
						let _imgurl = model.get('imageURL');
						if (_blob.url !== _imgurl){
							this.destroyBlob(_blob);
						}
					}
					catch(ex){}
					//GC for modal when transitioning
					if(_modalData){
						_modalData.deleteRecord();
					}
					let _transition = this.controller.get("tempTransition");
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
		destroyItem: function(model){
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
		updateItem: function(model){
			let _cat = this.controller.get('category') + "";
			this.controller.get('model.catItem').set('isUpdating', true);
			if(_cat.charAt(0) !== '<'){
				//alert(_cat);
				let cat = this.store.peekRecord('category', this.controller.get('category'));
				model.set('category', cat);
			}
			model.save().then(() => {
				this.controller.get('model.catItem').set('isUpdating', false);
				this.transitionTo('index.vendor');
				try{
				    let _blob = model.get('imageBlob');
				    let _imgurl = model.get('imageURL');
				    if (_blob.url !== _imgurl){
						this.destroyBlob(_blob);
				  	    //this.destroyBlob(_blob);
				    }					
				} catch(ex){}
			});
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
	uiSetup: function(){
	   // do magic here...
	}.on('didInsertElement').observes('model') 
});
