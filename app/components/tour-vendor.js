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
				      text: ['Here you keep track of all your listings<br>and information for users to find you!'],
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
				      title: 'View your services',
				      text: ['Keep track of all of the services that you advertise<br>on Bloom and edit them to suit your needs.'],
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
				      text: ['Add services so that users can find your<br>business at any time and get into contact with you.'],
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
						  element: '#nav-vendor-profile',
						  on: 'bottom'
						},
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Done',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Enhance your profile',
				      text: ['Ensure that your profile is up to date<br>and supercharged with all the information<br>that you want users to see!'],
				      when: {
				      	hide: () => {
				        	this.completeTour();				      		
				      	},
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
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