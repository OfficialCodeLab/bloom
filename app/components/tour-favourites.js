import Ember from 'ember';

const TourFavouritesComponent = Ember.Component.extend({
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
			var mustTourFavourites = user.get('mustTourFavourites');

			if(mustTourFavourites){
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
				    id: 'welcome-favs',
				    options: {
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'start',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Welcome to your favourites',
				      text: ['This section is all about you!<br>Keep track of your Favourite listings, Inner Circle and stats.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'your-favs',
				    options: {
				      attachTo: {
						  element: '#nav-my-favs',
						  on: 'bottom'
						},
				      // beforeShowPromise: function() {
				      //   return new Ember.RSVP.Promise(function(resolve) {
				      //     Ember.run.scheduleOnce('afterRender', _this, function() {
				      //       // window.scrollTo(0, 0);
				      //       //_this.get('documents.firstObject').set('isSelected', true);
				      //       resolve();
				      //     });
				      //   });
				      // },
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
				      title: 'Favouriting on Bloom',
				      text: ['Simply hit the favourite button for preferred listings.<br>Your favoured listing will be saved here.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'invite-friends',
				    options: {
				      attachTo: {
						  element: '#nav-innercircle',
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
				      title: 'Invite loved ones',
				      text: ['Take the weight off your shoulders by<br>assigning tasks or sharing your plans and<br>inspirations with the Inner circle feature.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'my-stats',
				    options: {
				      attachTo: {
						  element: '#nav-my-stats',
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
				      scrollTo: false,
				      title: 'Set up your stats',
				      text: ['Keep measurements up to date and on hand for when you need them.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'tour-done',
				    options: {
				      showCancelLink: true,
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-secondary',
				          text: 'Done',
				          type: 'cancel'
				        },
				      ],
				  	  disableScroll: true,
				      title: 'Voila!',
				      text: ['Start browsing categories and be inspired.<br>Get in touch with direct messaging and take that<br>one step closer to happily ever after.'],
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
			user.set('mustTourFavourites', false);
			user.save();
		});
	}
});


TourFavouritesComponent.reopenClass({
  positionalParams: ['userid']
});


export default TourFavouritesComponent;