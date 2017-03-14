import Ember from 'ember';

const TourVendorComponent = Ember.Component.extend({
  	tour: Ember.inject.service(),
  	storeName: '',
  	scroller: Ember.inject.service(),

	willInsertElement: function(){

		let _this = this;
		this.set('storeName', this.get('targetObject.store'));
        let store = this.get('storeName');
		let _id = this.get('userid');

		let scrollHandler = (el) => {		    
		    // Animate scrolling with Scroll To
		    this.get('scroller').scrollVertical(el, {duration:800, offset: -180});
		};

		store.findRecord('user', _id).then((user)=>{
			var mustTourVendor = user.get('mustTourVendor');

			if(mustTourVendor){
				this.get('tour').set('defaults', {
				  classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
				  scrollTo: true,
				  showCancelLink: true,
				  modal: true,
				  autoStart: true,
				  scrollToHandler: scrollHandler
				});
		    	this.get('tour').set('steps', [
				  {
				    id: 'welcome-vendor',
				    options: {
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Start',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Welcome to your vendor portal',
				      text: ['A quick introduction to your Bloom account and how it all works.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'view-services',
				    options: {
				      attachTo: {
						  element: '#nav-all-services',
						  on: 'bottom'
						},
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Back',
				          type: 'back'
				        },
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Next',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'View service listings',
				      text: ['Keep track and edit your listings here at any time.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'add-services',
				    options: {
				      attachTo: {
						  element: '#nav-add-services',
						  on: 'bottom'
						},
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Back',
				          type: 'back'
				        },
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Next',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Create Service Listings',
				      text: ['Add your services here to create your service listing.<br>You can have more than one listing, provided it<br>falls under a separate category.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'manage-profile',
				    options: {				    	
				      attachTo: {
						  element: '#nav-vendor-profile',
						  on: 'bottom'
						},
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Back',
				          type: 'back'
				        },
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Next',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Manage your profile',
				      text: ['Ensure your profile is up to date with all the information<br> users need to get in touch with you.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'outro',
				    options: {				    	
				      attachTo: {
						  element: '#nav-vendor-branding',
						  on: 'bottom'
						},
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-secondary',
				          text: 'Done',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Upload your branding',
				      text: ['Help users identify you better.<br>So that they know to come to you first.'],
				      when: {
				      	hide: () => {
				        	this.completeTour();				      		
				      	},
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  }
				  ]);
				this.toggleOverlay();
				this.get('tour').start();

			}
		});
	},
	toggleOverlay: function (){
		let isOverlay = this.get('isOverlay');
		if(isOverlay){
			Ember.$('#dark-overlay').fadeOut(1000);
			this.set('isOverlay', false);
		} else {
			Ember.$('#dark-overlay').fadeIn(1000);
			this.set('isOverlay', true);
		}

	},
	completeTour: function(){
		Ember.$('#dark-overlay').fadeOut(1000);
		this.set('isOverlay', false);
		let store = this.get('storeName');
		let _id = this.get('userid');
		store.findRecord('user', _id).then((user)=>{
			user.set('mustTourVendor', false);
			user.save();
		});
	}
});


TourVendorComponent.reopenClass({
  positionalParams: ['userid']
});


export default TourVendorComponent;